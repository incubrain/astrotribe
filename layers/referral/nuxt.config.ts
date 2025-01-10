import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@nuxtjs/supabase'],

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
