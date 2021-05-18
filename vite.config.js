import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

const target = 'http://localhost:8081'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    open: true,
    proxy: { // 代理
      '/api': {
        target,
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})