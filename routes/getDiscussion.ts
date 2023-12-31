import { accessTokenFetch } from '../utils/fetchs'

export default defineEventHandler(async (event) => {
  try {
    const origin = event.node.req.headers.origin
    if (origin?.includes('v2ex.com'))
      setHeader(event, 'Access-Control-Allow-Origin', origin)

    let { token, pathname } = getQuery(event) as { token: string; pathname: string }

    if (!token) {
      const response = await accessTokenFetch
      token = response.token
    }

    if (!pathname)
      throw new Error('pathname is required')
    const { data } = await $fetch<Promise<{ data: any }>>('https://api.github.com/graphql', {
      method: 'POST',
      body: JSON.stringify({
        query: `
          query($query: String!) {
            search(type: DISCUSSION last: 1 query: $query) {
              discussionCount
              nodes {
                ... on Discussion {
                  id
                  url
                  reactionGroups {
                    content
                    users {
                      totalCount
                    }
                    viewerHasReacted
                  }
                }
              }
            }
          }
        `,
        variables: {
          query: `repo:yuyinws/v2ex-reaction category:v2ex in:title ${pathname}`,
        },
      }),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return {
      data,
      state: 'ok',
    }
  }
  catch (error) {
    return {
      state: 'fail',
      data: String(error),
    }
  }
})
