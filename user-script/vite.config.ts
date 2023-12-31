import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import monkey, { cdn } from 'vite-plugin-monkey'
import turboConsole from 'vite-plugin-turbo-console'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        icon: 'https://vitejs.dev/logo.svg',
        namespace: 'npm/vite-plugin-monkey',
        match: ['*://*.v2ex.com/t/*'],
        name: 'v2ex-reaciton',
        author: 'yuyinws',
        license: 'MIT',
        description: '给v2ex增加emoji reaction功能',
        iconURL: 'https://www.v2ex.com/static/favicon.ico',
      },
      build: {
        externalGlobals: {
          vue: cdn.jsdelivr('Vue', 'dist/vue.global.prod.js'),
        },
        fileName: 'v2ex-reaction.user.js',
      },
    }),
    turboConsole(),
  ],
})
