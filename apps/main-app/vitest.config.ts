// apps/main-app/vitest.config.ts
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'
import { defineVitestConfig } from '@nuxt/test-utils/config'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineVitestConfig({
  root: currentDir,
  envDir: resolve(currentDir, '../../'),
  test: {
    dir: 'tests',
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        rootDir: fileURLToPath(new URL('.', import.meta.url)),
        domEnvironment: 'happy-dom', // or 'jsdom'
      },
    },
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './tests/coverage',
      all: true,
      clean: false, // Don't clean on each run
      cleanOnRerun: false, // Don't clean on rerun
      reportOnFailure: true, // Always report coverage
      include: [
        '**/*.{ts,js,vue}',
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
    testTimeout: 20000, // 20 seconds max per test
    hookTimeout: 10000, // 10 seconds max for hooks
    teardownTimeout: 5000, // 5 seconds max for teardown
    isolate: true, // Isolate tests in separate environments
    sequence: {
      shuffle: true, // Run tests in random order
    },
    globals: true,
    setupFiles: 'vitest.setup.ts',
  },
})
