import { createApp } from 'vue'
import App from './App.vue'
import './main.css'

createApp(App).mount(
  (() => {
    const emojiApp = document.createElement('div')
    emojiApp.id = 'emoji-reaction'
    const parentEL = document.querySelector('#Main > .box')
    const topicBtnEl = document.querySelector('.topic_buttons')
    parentEL.insertBefore(emojiApp, topicBtnEl)
    return emojiApp
  })(),
)
