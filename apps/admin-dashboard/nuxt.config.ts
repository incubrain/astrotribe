import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  workspaceDir: '../../',
  srcDir: '.',
  extends: ['../../layers/base'],
  modules: ['@nuxt/content'],
  ssr: false,
  routeRules: {
    '/**': { appMiddleware: 'auth' },
  },

  imports: {
    autoImport: true,
  },
})
