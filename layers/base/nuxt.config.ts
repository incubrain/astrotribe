import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  workspaceDir: '../../',
  srcDir: '.',

  icon: {
    serverBundle: {
      collections: ['material-symbols', 'mdi'],
    },
  },

  eslint: {
    checker: true,
  },

  components: [
    {
      path: './components',
      pathPrefix: false,
      prefix: 'IB',
      global: true,
    },
  ],
})
