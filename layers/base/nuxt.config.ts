import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  workspaceDir: '../../',
  srcDir: '.',

  icon: {
    serverBundle: {
      collections: ['material-symbols', 'mdi'],
    },
  },

  debug: true,

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
