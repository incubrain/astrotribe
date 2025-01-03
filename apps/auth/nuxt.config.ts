import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { defineNuxtConfig } from 'nuxt/config'
import sharedConfig from '../../shared-runtime.config'

const currentDir = dirname(fileURLToPath(import.meta.url))

// REQUIRED FOR LOGGER
process.env.SERVICE_NAME = '@astronera/auth'

export default defineNuxtConfig({
  workspaceDir: '../../',
  srcDir: '.',
  extends: [
    '../../layers/base',
    '../../layers/supabase',
    '../../layers/crud',
    '../../layers/referral',
  ],
  build: {
    transpile: ['../../layers/base', '../../layers/supabase', '../../layers/crud'],
  },
  modules: [
    '@nuxt/devtools',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
  ],

  devServer: {
    host: 'localhost',
    port: 3009,
  },

  ssr: false,

  primevue: {
    importPT: { from: resolve(currentDir, '../../theme/index.js') },
    autoImport: true,
    components: {
      prefix: 'Prime',
      include: '*',
      exclude: ['Editor'],
    },

    composables: {
      include: '*',
    },

    options: {
      ripple: true,
      unstyled: true,
      theme: {
        options: {
          cssLayer: {
            name: 'primevue',
            order: 'tailwind-base, primevue, tailwind-utilities',
          },
        },
      },
    },
  },

  routeRules: {
    '/': { redirect: '/login' },
  },

  compatibilityDate: '2024-10-03',

  runtimeConfig: {
    serviceName: '@astronera/auth',
    ...sharedConfig.runtimeConfig.private,
    public: {
      serviceName: '@astronera/auth',
      ...sharedConfig.runtimeConfig.public,
    },
  },
})
