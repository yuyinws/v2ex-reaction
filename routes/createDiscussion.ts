import { accessTokenFetch } from '../utils/fetchs'

export default defineEventHandler(async (event) => {
  try {
    const origin = event.node.req.headers.origin
    if (origin?.includes('v2ex.com'))
      setHeader(event, 'Access-Control-Allow-Origin', origin)

    const { pathname } = getQuery(event) as { pathname: string }
    if (!pathname)
      throw new Error('pathname is required')

    const { token } = await accessTokenFetch
    const { data: discussionData } = await $fetch<Promise<{ data: any }>>('/getDiscussion', {
      params: {
        pathname,
      },
    })

    if (discussionData.search.discussionCount > 0)
      throw new Error('discussion already exists')

    const { data } = await $fetch<Promise<{ data: any }>>('https://api.github.com/graphql', {
      method: 'POST',
      body: JSON.stringify({
        query: `
        mutation($input: CreateDiscussionInput!) {
          createDiscussion(input: $input) {
            discussion {
              id
              url
            }
          }
        }
      `,
        variables: {
          input: {
            repositoryId: 'R_kgDOJy8j8g',
            categoryId: 'DIC_kwDOJy8j8s4CXbz6',
            title: pathname,
            body: `[v2ex原帖](https://v2ex.com${pathname})`,
          },
        },
      }),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return {
      state: 'ok',
      data,
    }
  }
  catch (error) {
    return {
      state: 'fail',
      data: String(error),
    }
  }
})
