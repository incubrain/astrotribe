import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@nuxt/image'],
  $meta: {
    name: 'base',
  },
  components: [
    {
      path: './components',
      pathPrefix: false,
      prefix: 'IB',
      global: true,
    },
  ],

  future: {
    compatibilityVersion: 4,
  },

  nitro: {
    experimental: {
      asyncContext: true,
    },
  },
})
