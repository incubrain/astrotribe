// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['/layers/base'],

  routeRules: {
    '/**': { appMiddleware: 'auth' },
  },

  runtimeConfig: {
    influxUrl: '',
    influxToken: '',
    influxOrg: '',
    influxBucket: '',
  }
})