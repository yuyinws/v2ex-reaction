import { ref } from 'vue'
import { getSearchParam } from '../utils/tools'
import { serverDomin } from '../utils/constantce'

const token = ref('')
const authURL = ref('')
const isAuth = ref(false)

export function useAuth() {
  async function genAuthURL() {
    const href = window.location.href
    const response = await fetch(`${serverDomin}/authorize?app_return_url=${href}`)
    const data = await response.text()
    authURL.value = data
  }

  function setToken() {
    const emoji_token = getSearchParam('emoji-reaction-token') || localStorage.getItem('emoji-reaction-token')
    if (emoji_token) {
      localStorage.setItem('emoji-reaction-token', emoji_token)
      token.value = emoji_token
      isAuth.value = true
    }
  }

  setToken()

  return {
    genAuthURL,
    authURL,
    token,
    isAuth,
  }
}
