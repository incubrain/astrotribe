import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { defineNuxtConfig } from 'nuxt/config'
import { sharedRuntimeConfig } from '../../shared/runtime.config'
import { devPortMap } from '../../shared/paths.config'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  extends: [
    '../../layers/logging',
    '../../layers/base',
    '../../layers/supabase',
    '../../layers/crud',
    '../../layers/referral',
  ],

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

  ssr: false,

  runtimeConfig: {
    serviceName: 'auth',
    ...sharedRuntimeConfig.runtimeConfig.private,
    public: {
      serviceName: 'auth',
      ...sharedRuntimeConfig.runtimeConfig.public,
    },
  },
  srcDir: '.',
  workspaceDir: '../../',

  build: {
    transpile: [
      '../../layers/base',
      '../../layers/supabase',
      '../../layers/crud',
      '../../layers/logging',
      '../../layers/referral',
    ],
  },

  routeRules: {
    '/': { redirect: '/login' },
  },

  devServer: {
    host: 'localhost',
    port: process.env.NUXT_MULTI_APP ? devPortMap.auth : 3009,
  },

  compatibilityDate: '2024-10-03',

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
})
