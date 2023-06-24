import { getJWT } from './jwt'

export const accessTokenFetch = $fetch<Promise<{ token: string }>>('https://api.github.com/app/installations/38897406/access_tokens', {
  method: 'POST',
  headers: {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `Bearer ${getJWT()}`,
  },
})
