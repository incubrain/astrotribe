import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  workspaceDir: '../../',
  srcDir: '.',

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

  runtimeConfig: {
    public: {
      aeAuthUrl: '',
      aeLoginUrl: '',
      aeAppUrl: '',
      aeAdminUrl: '',
      aeMonitoringUrl: '',
      aeWebsiteUrl: '',
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
