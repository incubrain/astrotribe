import { defineConfig } from 'vitest/config.js'

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    alias: {
      '@core': '/src/core',
      '@content': '/src/content',
      '@auth': '/src/auth',
    },
  },
})
