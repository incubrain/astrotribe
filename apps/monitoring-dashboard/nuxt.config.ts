import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  workspaceDir: '../../',
  srcDir: '.',
  extends: ['../../layers/base'],

  routeRules: {
    '/**': { appMiddleware: 'auth' },
  },

  imports: {
    autoImport: true,
  },

  runtimeConfig: {
    influxUrl: '',
    influxToken: '',
    influxOrg: '',
    influxBucket: '',
  },
})
