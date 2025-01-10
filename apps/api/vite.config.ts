import { resolve } from 'path'
import { defineConfig, type UserConfig } from 'vite'
import { devPortMap } from '../../shared/paths.config'

export default defineConfig(({ command, mode }) => {
  const baseConfig = {
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
  }

  if (command === 'serve') {
    return {
      ...baseConfig,
      server: {
        // Check if we're running in a multi-app dev environment
        host: 'localhost',
        port: process.env.NUXT_MULTI_APP ? devPortMap.api : 8080,
        strictPort: true, // Fail if port is in use
      },
    }
  }

  return baseConfig
})
