export default defineNuxtConfig({
  extends: ['../../layers/base'],
  devServer: {
    port: 3009,
  },

  routeRules: {
    '/': { redirect: '/register' },
  },
})
