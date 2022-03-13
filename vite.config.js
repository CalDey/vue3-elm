import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// const baseUrl = {
//   development: './',
//   beta: './',
//   release: './'
// }

export default defineConfig({
  plugins: [
    vue()
  ],
  resolve: {
    alias: {  // 设置别名
      '~': path.resolve(__dirname, './'),
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.vue', '.js', '.jsx', '.json']
  },
  server: {
    host:'0.0.0.0',
    proxy: {
      '/v1': {
        target: 'http://cangdu.org:8001',
        changeOrigin: true
      },
      '/v2': {
        target: 'http://cangdu.org:8001',
        changeOrigin: true
      },
      '/v4': {
        target: 'http://cangdu.org:8001',
        changeOrigin: true
      },
      "/img": {
        target: "http://cangdu.org:8001",   // 代理地址
        changeOrigin: true, // 是否跨域
      },
      "/shopping": {
        target: "http://cangdu.org:8001",   // 代理地址
        changeOrigin: true, // 是否跨域
      },
      "/ugc": {
        target: "http://cangdu.org:8001",   // 代理地址
        changeOrigin: true, // 是否跨域
      },
      "/bos": {
        target: "http://cangdu.org:8001",   // 代理地址
        changeOrigin: true, // 是否跨域
      },
      "/payapi": {
        target: "http://cangdu.org:8001",   // 代理地址
        changeOrigin: true, // 是否跨域
      },
      "/eus": {
        target: "http://cangdu.org:8001",   // 代理地址
        changeOrigin: true, // 是否跨域
      },
    }
  }
})
