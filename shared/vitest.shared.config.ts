// vitest.shared.config.ts
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'
import { defineConfig } from 'vitest/config'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.spec.ts', '**/*.nuxt.spec.ts'],
    deps: {
      inline: [/nuxt/, /@nuxt/],
    },
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      include: [
        'src/**/*.{ts,js,vue}',
        'components/**/*.{ts,js,vue}',
        'layouts/**/*.{ts,js,vue}',
        'pages/**/*.{ts,js,vue}',
        'composables/**/*.{ts,js,vue}',
      ],
      exclude: [
        'node_modules',
        'dist',
        'coverage',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/types/**',
        '**/mocks/**',
      ],
    },
  },
  resolve: {
    alias: {
      '#layers': fileURLToPath(new URL('./layers', import.meta.url)),
    },
  },
})
