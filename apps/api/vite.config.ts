import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, './src') },
      { find: '@types', replacement: resolve(__dirname, './types') },
      { find: '@auth', replacement: resolve(__dirname, './src/auth') },
      { find: '@common', replacement: resolve(__dirname, './src/common') },
      { find: '@content', replacement: resolve(__dirname, './src/content') },
      { find: '@core', replacement: resolve(__dirname, './src/core') },
      { find: '@engagement', replacement: resolve(__dirname, './src/engagement') },
      { find: '@location', replacement: resolve(__dirname, './src/location') },
      { find: '@monitoring', replacement: resolve(__dirname, './src/monitoring') },
      { find: '@org', replacement: resolve(__dirname, './src/org') },
      { find: '@payments', replacement: resolve(__dirname, './src/payments') },
      { find: '@search', replacement: resolve(__dirname, './src/search') },
      { find: '@security', replacement: resolve(__dirname, './src/security') },
      { find: '@advertising', replacement: resolve(__dirname, './src/advertising') },
    ],
  },
})
