export default defineEventHandler((event) => {
  return sendRedirect(event, 'https://github.com/yuyinws/v2ex-reaction', 302)
})
