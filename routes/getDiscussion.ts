export default defineEventHandler(async (eventHandler) => {
  // 使用GitHub GraphQL API获取仓库的讨论的reaciton
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
      Authorization: 'Bearer ',
    },
  })

  return {
    response,
  }
})
