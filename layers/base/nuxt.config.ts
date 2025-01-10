import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@nuxt/image'],
  components: [
    {
      path: './components',
      pathPrefix: false,
      prefix: 'IB',
      global: true,
    },
  ],
  srcDir: '.',

  workspaceDir: '../../',

  // remove after debuggin
  sourcemap: true,

  experimental: {
    defaults: {
      nuxtLink: {
        prefetch: false,
      },
    },
  },

  nitro: {
    experimental: {
      asyncContext: true,
    },
  },

  eslint: {
    checker: true,
  },

  icon: {
    preload: true,
    provider: 'server',
    serverBundle: {
      collections: ['material-symbols', 'mdi', 'game-icons'],
    },
    clientBundle: {
      scan: true,
    },
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
})
