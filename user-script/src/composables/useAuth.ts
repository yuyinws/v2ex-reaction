import { ref } from 'vue'
import { getSearchParam } from '../utils/tools'

const token = ref('')

export function useAuth() {
  const isAuth = ref(false)
  const authURL = ref('')

  async function genAuthURL() {
    const href = window.location.href
    const response = await fetch(`https://v2ex-reaction.vercel.app/authorize?app_return_url=${href}`)
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
