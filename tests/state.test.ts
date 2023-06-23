import { expect, it } from 'vitest'
import { decodeState, encodeState } from '../utils/state'

it('state', async () => {
  const encoded = await encodeState('hello', 'pwd')
  const decoded = await decodeState(encoded, 'pwd')
  expect(decoded).toBe('hello')
})
