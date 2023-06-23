import { CLIENT_ID, ENCRYPTION_PASSWORD, GITHUB_OAUTH_AUTHORIZE_URL } from '../utils/constance'
import { encodeState } from '../utils/state'

export default defineEventHandler(async (event) => {
  const { app_return_url } = getQuery(event) as { app_return_url: string }
  const client_id = CLIENT_ID
  const state = await encodeState(app_return_url, ENCRYPTION_PASSWORD)

  const oauthParams = new URLSearchParams({ client_id, state })
  return `${GITHUB_OAUTH_AUTHORIZE_URL}?${oauthParams.toString()}`
})
