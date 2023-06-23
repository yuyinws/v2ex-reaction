<script setup lang="ts">
import { onMounted } from 'vue'
import Menu from './components/Menu.vue'
import { useAuth, useReaction } from './composables'

const { reactions, getReaction, filteredReactions, totalCount, clickReaction } = useReaction()
const { genAuthURL, authURL, isAuth, token } = useAuth()

function init() {
  if (!isAuth.value)
    genAuthURL()
  else
    getReaction()
}

onMounted(() => {
  init()
})
</script>

<template>
  <div class="emoji-reaction">
    <span v-if="!isAuth">{{ authURL }}</span>
    <div class="emoji-title">
      {{ totalCount }}个反应
    </div>
    <div class="emoji-list">
      <Menu :reactions="reactions" />
      <div
        v-for="(item, index) in filteredReactions" :key="index"
        :class="item.viewerHasReacted ? 'emoji-counter-reacted' : ''"
        class="emoji-counter"
        @click="clickReaction(item.content, token, item.viewerHasReacted)"
      >
        {{ item.emoji }} {{ item.totalCount }}
      </div>
    </div>
  </div>
</template>
