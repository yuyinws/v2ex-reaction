import jwt from 'jsonwebtoken'
import { APP_ID, GITHUB_PRIVATE_KEY } from './constance'

export function getJWT() {
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    // Issued at time, 60 seconds in the past to allow for clock drift
    iat: now - 60,
    // JWT expiration time (10 minute maximum)
    exp: now + 10 * 60,
    // GitHub App's identifier
    iss: APP_ID,
  }
  return jwt.sign(payload, GITHUB_PRIVATE_KEY, { algorithm: 'RS256' })
}
