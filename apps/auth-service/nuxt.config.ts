import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  workspaceDir: '../../',
  srcDir: '.',
  extends: ['../../layers/base'],
  devServer: {
    host: 'localhost',
    port: 3009,
  },

  modules: [],

  imports: {
    autoImport: true,
  },

  routeRules: {
    '/': { redirect: '/register' },
  },
})
