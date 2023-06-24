export const emojiMap: Record<string, string> = {
  THUMBS_UP: '👍',
  THUMBS_DOWN: '👎',
  LAUGH: '😄',
  HOORAY: '🎉',
  CONFUSED: '😕',
  HEART: '❤️',
  ROCKET: '🚀',
  EYES: '👀',
}

export const serverDomin = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://v2ex-reaction.vercel.app'
