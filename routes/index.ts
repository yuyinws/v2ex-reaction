export default defineEventHandler((event) => {
  return sendRedirect(event, 'https://github/yuyinws/v2ex-reaction', 302)
})
