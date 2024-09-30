import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { defineNuxtConfig } from 'nuxt/config'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  workspaceDir: '../../',
  srcDir: '.',
  extends: ['../../layers/base'],
  modules: [
    '@nuxt/devtools',
    '@vueuse/nuxt',
    '@nuxt/content',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@primevue/nuxt-module',
  ],
  ssr: false,
  routeRules: {
    '/**': { appMiddleware: 'auth' },
  },

  nitro: {
    experimental: {
      websocket: true,
    },
  },

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
          cssLayer: true,
        },
      },
    },
  },

  imports: {
    autoImport: true,
  },
})
