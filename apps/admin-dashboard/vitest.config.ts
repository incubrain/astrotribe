// apps/admin-dashboard/vitest.config.ts
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
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './tests/coverage',
      include: ['**/*.{ts,js,vue}'],
      exclude: ['node_modules', 'tests', 'dist'],
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
