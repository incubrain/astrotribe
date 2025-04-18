import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@nuxtjs/supabase', '@nuxt/image'],
  $meta: {
    name: 'advert',
  },

  components: [
    {
      path: './components',
      pathPrefix: false,
      prefix: 'Ads',
      global: true,
    },
  ],

  future: {
    compatibilityVersion: 4,
  },

  supabase: {
    url: process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_KEY,
    serviceKey: process.env.NUXT_SUPABASE_SERVICE_KEY,
    redirect: false,
  },
})
