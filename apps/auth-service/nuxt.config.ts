import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { defineNuxtConfig } from 'nuxt/config'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  workspaceDir: '../../',
  srcDir: '.',
  // extends: ['../../layers/base'],
  devServer: {
    host: 'localhost',
    port: 3009,
  },

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

  modules: ['@primevue/nuxt-module'],

  imports: {
    autoImport: true,
  },

  routeRules: {
    '/': { redirect: '/register' },
  },
})
