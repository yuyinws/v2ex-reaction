import { accessTokenFetch } from '../utils/fetchs'

export default defineEventHandler(async () => {
  const response = await accessTokenFetch
  // const response = await $fetch('https://api.github.com/graphql', {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     query: `
  //       mutation($input: CreateDiscussionInput!) {
  //         createDiscussion(input: $input) {
  //           discussion {
  //             id
  //             url
  //           }
  //         }
  //       }
  //     `,
  //     variables: {
  //       input: {
  //         repositoryId: 'R_kgDOJy8j8g',
  //         categoryId: 'DIC_kwDOJy8j8s4CXbz6',
  //         title: '1232134hxxxxhhhh',
  //         body: '44444bbxxxbb',
  //       },
  //     },
  //   }),
  //   headers: {
  //     Authorization: `Bearer ${getJWT()}`,
  //   },
  // })

  return {
    response,
  }
})
