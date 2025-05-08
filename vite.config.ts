import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import electronRender from 'vite-plugin-electron-renderer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    electron({
      // 主进程入口文件
      entry: './src-electron/main.js'
    }),
    // electron({
    //   entry: './src-electron/preload.ts',
    // }),
    // electronRender()
  ],
  /*开发服务器选项*/
  server: {
    // 端口
    port: 5001,
  }

})
