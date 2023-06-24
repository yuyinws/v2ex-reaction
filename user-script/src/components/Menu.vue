<script setup lang="ts">
import { ref } from 'vue'
import type { PropType } from 'vue'
import type { Reaction } from '../types'
import { useAuth, useReaction } from '../composables'

defineProps({
  reactions: {
    type: Array as PropType<Reaction[]>,
    required: true,
  },
  color: {
    type: String,
    default: '#000',
  },
})

const { clickReaction } = useReaction()
const { token, isAuth, authURL } = useAuth()

const emojiPanelRef = ref(null)

const vClickOutside = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = function (event) {
      if (!(el === event.target || el.contains(event.target)))
        binding.value(event)
    }
    document.addEventListener('mousedown', el.clickOutsideEvent)
  },
  beforeUnmount(el) {
    document.removeEventListener('mousedown', el.clickOutsideEvent)
  },
}

function handleClickOutside() {
  emojiPanelRef.value.open = false
}
</script>

<template>
  <div class="emoji-list">
    <details ref="emojiPanelRef" v-click-outside="handleClickOutside" class="emoji-menu">
      <summary class="emoji-face-icon">
        <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 16 16" width="16" height="16" :fill="color" style="display: inline-block; user-select: none; vertical-align: text-bottom; overflow: visible;"><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm3.82 1.636a.75.75 0 0 1 1.038.175l.007.009c.103.118.22.222.35.31.264.178.683.37 1.285.37.602 0 1.02-.192 1.285-.371.13-.088.247-.192.35-.31l.007-.008a.75.75 0 0 1 1.222.87l-.022-.015c.02.013.021.015.021.015v.001l-.001.002-.002.003-.005.007-.014.019a2.066 2.066 0 0 1-.184.213c-.16.166-.338.316-.53.445-.63.418-1.37.638-2.127.629-.946 0-1.652-.308-2.126-.63a3.331 3.331 0 0 1-.715-.657l-.014-.02-.005-.006-.002-.003v-.002h-.001l.613-.432-.614.43a.75.75 0 0 1 .183-1.044ZM12 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM5 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm5.25 2.25.592.416a97.71 97.71 0 0 0-.592-.416Z" /></svg>
      </summary>
      <div class="emoji-panel">
        <template v-if="!isAuth">
          <a :href="authURL" class="emoji-panel-login">登录</a>
          <span style="font-size: 12px;font-style: italic;color: #94a3b8">以添加反应</span>
        </template>
        <div class="emoji-panel-list">
          <div
            v-for="(item, index) in reactions" :key="index"
            :class="[
              item.viewerHasReacted ? 'emoji-item-reacted' : '',
              isAuth ? '' : 'emoji-item-disabled',
            ]"
            class="emoji-item"
            @click="clickReaction(isAuth, item.content, token, item.viewerHasReacted)"
          >
            {{ item.emoji }}
          </div>
        </div>
      </div>
    </details>
  </div>
</template>
