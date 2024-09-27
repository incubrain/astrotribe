import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { defineNuxtConfig } from 'nuxt/config'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  workspaceDir: '../../',
  srcDir: '.',
  // extends: ['../../layers/base'],

  modules: ['nuxt-tiptap-editor', '@primevue/nuxt-module'],

  primevue: {
    importPT: { from: resolve(currentDir, './theme/index.js') },
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

  experimental: {
    inlineRouteRules: true,
    asyncContext: true,
  },

  tiptap: {
    prefix: 'Tiptap',
  },

  routeRules: {
    '/**': { appMiddleware: 'auth' },
  },

  imports: {
    autoImport: true,
  },
})
