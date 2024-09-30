import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { defineNuxtConfig } from 'nuxt/config'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  workspaceDir: '../../',
  srcDir: '.',

  modules: [],

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

  nitro: {
    preset: 'node-server',
  },

  vite: {
    optimizeDeps: {
      exclude: ['fsevents'],
    },
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
