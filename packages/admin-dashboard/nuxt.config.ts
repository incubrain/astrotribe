export default defineNuxtConfig({
  extends: ['../../layers/base'],
  modules: ['@nuxt/content'],
  ssr: false,
  routeRules: {
    '/**': { appMiddleware: 'auth' },
  },
})
