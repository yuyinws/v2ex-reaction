import { aesGcmDecrypt, aesGcmEncrypt } from './encryption'

interface State {
  value: string
}

export async function encodeState(
  value: string,
  password: string,
) {
  const state: State = { value }
  return aesGcmEncrypt(JSON.stringify(state), password)
}

export async function decodeState(encryptedState: string, password: string) {
  let state: State
  try {
    const decrypted = await aesGcmDecrypt(encryptedState, password)
    state = JSON.parse(decrypted)
  }
  catch (err) {
    throw new Error('Invalid state value.')
  }

  return state.value
}
