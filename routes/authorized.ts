import { CLIENT_ID, CLIENT_SECRET, ENCRYPTION_PASSWORD } from '../utils/constance'

export default defineEventHandler(async (event) => {
  try {
    const client_id = CLIENT_ID
    const client_secret = CLIENT_SECRET
    const { code, state } = getQuery(event) as { code: string; state: string }
    const app_return_url = await decodeState(state, ENCRYPTION_PASSWORD)
    const response = await $fetch<Promise<{ access_token: string }>>('https://github.com/login/oauth/access_token', {
      method: 'POST',
      body: {
        client_id,
        client_secret,
        code,
      },
      headers: {
        Accept: 'application/json',
      },
    })

    const returnUrl = new URL(app_return_url)
    returnUrl.searchParams.set('emoji-reaction-token', response.access_token)

    return sendRedirect(event, returnUrl.href, 302)
  }
  catch (error) {
    return {
      error,
    }
  }
})
