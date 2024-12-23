import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  workspaceDir: '../../',
  srcDir: '.',

  modules: ['@nuxtjs/supabase'],

  components: [
    {
      path: './components',
      pathPrefix: false,
      prefix: 'Test',
      global: true,
    },
  ],
})
