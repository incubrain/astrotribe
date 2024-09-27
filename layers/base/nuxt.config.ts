import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { defineNuxtConfig } from 'nuxt/config'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  workspaceDir: '../../',
  srcDir: '.',

  modules: [
    '@nuxt/devtools',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
  ],

  css: [resolve(currentDir, './assets/css/tailwind.css')],

  image: {
    format: ['webp', 'jpg'],
    image: {
      domains: ['dohemiycqebeipbvsvnr.supabase.co'],
      presets: {
        cover: {
          modifiers: {
            format: 'jpg',
            quality: 80,
            sizes: 'sm:100vw md:50vw lg:800px',
          },
        },
        card: {
          modifiers: {
            format: 'jpg',
            quality: 70,
            sizes: 'sm:100vw md:40vw lg:300px',
          },
        },
      },
    },
  },

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

  supabase: {
    redirect: false,
    clientOptions: {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    },
    cookieName: 'sb',
  },

  nitro: {
    preset: 'node-server',
    experimental: {
      websocket: true,
    },
  },

  vite: {
    // resolve: {
    //   alias: {
    //     primevue: '../../node_modules/primevue',
    //   },
    // },
    optimizeDeps: {
      exclude: ['fsevents'],
    },
  },

  build: {
    // optimization: {
    //   splitChunks: {
    //     chunks: 'all',
    //     automaticNameDelimiter: '.',
    //     name: undefined,
    //     cacheGroups: {
    //       components: {
    //         test: /\/(components|composables)\//,
    //         name: 'components',
    //         chunks: 'all',
    //         enforce: true,
    //       },
    //       financials: {
    //         test: /\/financials\//,
    //         name: 'financials',
    //         chunks: 'all',
    //         enforce: true,
    //       },
    //       server: {
    //         test: /\/server\//,
    //         name: 'server',
    //         chunks: 'all',
    //         enforce: true,
    //       },
    //       vendor: {
    //         test: /[\\/]node_modules[\\/]/,
    //         name: 'vendor',
    //         chunks: 'all',
    //         priority: -10,
    //       },
    //     },
    //   },
    // },
  },
  typescript: {
    shim: true,
    tsConfig: {
      exclude: ['node_modules', 'dist', 'theme', 'types'],
      compilerOptions: {
        strict: false,
      },
    },
  },
  devtools: {
    enabled: true,
    vscode: {},

    timeline: {
      enabled: true,
    },
  },

  runtimeConfig: {
    public: {
      authUrl: 'http://localhost:3009',
      loginUrl: 'http://localhost:3009/login',
      // client
      nodeEnv: process.env.NODE_ENV,
      logLevel: '',
      posthogKey: '',
      posthogUrl: '',
      studioTokens: '',
      scraperUrl: '',
      devHelper: {
        enabled: process.env.NUXT_PUBLIC_IB_DEVEX === 'true',
        features: {
          networkErrorClassifier: true,
          infiniteLoopDetector: true,
          unhandledPromiseRejectionTracker: true,
          environmentConsistencyChecker: true,
        },
      },
    },
    googleApiKey: '',
    supabaseServiceKey: '',
    nasaApiKey: '',
    openaiApiKey: '',
    openaiOrg: '',
    redisFlushKey: '',
    scraperKey: '',
    razorpayKey: '',
    razorpaySecret: '',
    razorpayTestKey: '',
    razorpayTestSecret: '',
  },
})
