export default defineEventHandler(async (event) => {
  try {
    const origin = event.node.req.headers.origin
    if (origin.includes('v2ex.com')) {
      setHeader(event, 'Access-Control-Allow-Origin', origin)
      const { token } = getQuery(event) as { token: string }
      const response = await $fetch('https://api.github.com/graphql', {
        method: 'POST',
        body: {
          query: `
        query {
          repository(owner: "yuyinws", name: "v2ex-reaction") {
            discussion(number: 1) {
              id
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
        `,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return {
        response,
      }
    }
  }
  catch (error) {

  }
})
