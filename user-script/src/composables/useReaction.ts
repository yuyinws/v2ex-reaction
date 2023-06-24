import { computed, ref } from 'vue'
import type { Reaction } from '../types'
import { emojiMap, serverDomin } from '../utils/constantce'

const reactions = ref<Reaction[]>([])
const subjectId = ref('')
const filteredReactions = computed(() => {
  return reactions.value.filter(reaction => reaction.totalCount > 0)
})

const totalCount = computed(() => {
  return filteredReactions.value.reduce((total, reaction) => {
    return total + reaction.totalCount
  }, 0)
})

export function useReaction() {
  const discussionUrl = ref('')
  const loading = ref(false)
  async function getReaction() {
    try {
      loading.value = true
      const pathname = window.location.pathname
      const token = localStorage.getItem('emoji-reaction-token')
      const url = new URL(`${serverDomin}/getDiscussion`)
      if (token)
        url.searchParams.append('token', token as string)
      if (pathname)
        url.searchParams.append('pathname', pathname)

      const response = await fetch(url.toString())
      const { data, state } = await response.json()
      if (state === 'fail')
        throw new Error(data)

      const reactionNodes = data.search.nodes

      if (!reactionNodes.length) {
        const createUrl = new URL(`${serverDomin}/createDiscussion`)
        if (pathname)
          createUrl.searchParams.append('pathname', pathname)
        const res = await fetch(createUrl)
        const createData = await res.json()
        if (createData.state === 'ok') {
          setTimeout(() => {
            getReaction()
          }, 2000)
        }
      }
      else {
        const reactionGroups = reactionNodes[0].reactionGroups
        const discussionId = reactionNodes[0].id
        const _discussionUrl = reactionNodes[0].url
        subjectId.value = discussionId
        discussionUrl.value = _discussionUrl
        reactions.value = reactionGroups.map((reaction: any) => {
          return {
            content: reaction.content,
            totalCount: reaction.users.totalCount,
            viewerHasReacted: reaction.viewerHasReacted,
            emoji: emojiMap[reaction.content],
          }
        })
      }
    }
    catch (error) {
      console.log(error)
    }
    finally {
      loading.value = false
    }
  }

  const TOGGLE_REACTION_QUERY = (mode: 'add' | 'remove') => `
  mutation($content: ReactionContent!, $subjectId: ID!) {
    toggleReaction: ${mode}Reaction(input: {content: $content, subjectId: $subjectId}) {
      reaction {
        content
        id
      }
    }
  }`

  async function clickReaction(isAuth: boolean, content: string, token: string, viewerHasReacted: boolean, cb?: () => void) {
    try {
      if (!isAuth)
        return
      await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: TOGGLE_REACTION_QUERY(viewerHasReacted ? 'remove' : 'add'),
          variables: {
            subjectId: subjectId.value,
            content,
          },
        }),
      })

      await getReaction()
    }
    catch (error) {
      console.log(error)
    }
    finally {
      cb()
    }
  }

  return {
    reactions,
    getReaction,
    filteredReactions,
    totalCount,
    clickReaction,
    discussionUrl,
    loading,
  }
}
