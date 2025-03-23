import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@nuxtjs/supabase'],

  $meta: {
    name: 'testing',
  },

  components: [
    {
      path: './components',
      pathPrefix: false,
      prefix: 'Test',
      global: true,
    },
  ],
  srcDir: '.',
  workspaceDir: '../../',
})
