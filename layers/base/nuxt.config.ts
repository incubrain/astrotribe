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
        name: 'supabase',
        provider: '../../layers/base/supabase-provider',
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
