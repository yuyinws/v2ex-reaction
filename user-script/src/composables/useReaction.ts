import { computed, ref } from 'vue'
import type { Reaction } from '../types'
import { emojiMap } from '../utils/constantce'

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
  async function getReaction() {
    const token = localStorage.getItem('emoji-reaction-token')
    const response = await fetch(`http://localhost:3000/getDiscussion?token=${token}`)
    const data = await response.json()
    const reactionGroups = data.response.data.repository.discussion.reactionGroups
    const discussionId = data.response.data.repository.discussion.id
    subjectId.value = discussionId
    reactions.value = reactionGroups.map((reaction: any) => {
      return {
        content: reaction.content,
        totalCount: reaction.users.totalCount,
        viewerHasReacted: reaction.viewerHasReacted,
        emoji: emojiMap[reaction.content],
      }
    })
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

  async function clickReaction(content: string, token: string, viewerHasReacted: boolean) {
    try {
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
  }

  return {
    reactions,
    getReaction,
    filteredReactions,
    totalCount,
    clickReaction,
  }
}
