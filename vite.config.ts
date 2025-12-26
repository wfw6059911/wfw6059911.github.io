import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // 百度热搜 API 代理
      '/api/baidu-hot': {
        target: 'https://top.baidu.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/baidu-hot/, ''),
      },
    },
  },
  // 构建优化配置
  build: {
    // 代码分割策略
    rollupOptions: {
      output: {
        manualChunks: {
          // 将 React 相关库打包到一个 chunk
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // 将 Ant Design 打包到单独的 chunk
          'vendor-antd': ['antd', '@ant-design/icons'],
        },
      },
    },
    // chunk 大小警告阈值
    chunkSizeWarningLimit: 500,
    // 生产环境不生成 sourcemap
    sourcemap: false,
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 压缩选项
    minify: 'esbuild',
    // 目标浏览器
    target: 'es2020',
  },
})
