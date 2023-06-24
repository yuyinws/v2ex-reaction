<script setup lang="ts">
import { onMounted } from 'vue'
import Menu from './components/Menu.vue'
import { useAuth, useReaction } from './composables'

const {
  reactions, getReaction, filteredReactions,
  totalCount, clickReaction, discussionUrl, loading,
} = useReaction()
const { genAuthURL, isAuth, token } = useAuth()

function init() {
  if (!isAuth.value)
    genAuthURL()

  getReaction()
}

onMounted(() => {
  init()
})
</script>

<template>
  <div v-if="loading">
    Loading
  </div>
  <div v-else>
    <div class="emoji-reaction">
      <a class="emoji-title" :href="discussionUrl" target="_blank">
        {{ totalCount }}个反应
      </a>
      <div class="emoji-list">
        <Menu :reactions="reactions" color="#444" />
        <div
          v-for="(item, index) in filteredReactions" :key="index"
          :class="[
            item.viewerHasReacted ? 'emoji-counter-reacted' : '',
            isAuth ? '' : 'emoji-item-disabled',
          ]"
          class="emoji-counter"
          @click="clickReaction(isAuth, item.content, token, item.viewerHasReacted)"
        >
          {{ item.emoji }} {{ item.totalCount }}
        </div>
      </div>
    </div>
  </div>
</template>
