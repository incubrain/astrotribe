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

  image: {
    providers: {
      supabase: {
        provider: '../../layers/base/supabase-provider.ts',
        options: {
          baseURL: process.env.NUXT_PUBLIC_SUPABASE_URL,
        },
      },
    },
    presets: {
      original: {
        modifiers: {
          width: 1920,
          height: 1080,
        },
      },
      mobile: {
        modifiers: {
          width: 768,
          height: 1024,
        },
      },
      thumbnail: {
        modifiers: {
          width: 300,
          height: 200,
        },
      },
    },
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
