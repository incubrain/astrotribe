import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@nuxtjs/supabase'],

  $meta: {
    name: 'referral',
  },

  components: [
    {
      path: './components',
      pathPrefix: false,
      prefix: '',
      global: true,
    },
  ],
  srcDir: '.',
  workspaceDir: '../../',
})
