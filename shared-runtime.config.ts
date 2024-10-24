import { config } from 'dotenv'

config()

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      strapiUrl: process.env.NUXT_PUBLIC_STRAPI_URL,
      formbricksEnvironment: process.env.NUXT_PUBLIC_FORMBRICKS_ENVIRONMENT,
      formbricksHost: process.env.NUXT_PUBLIC_FORMBRICKS_HOST,
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY,
      aeAuthUrl: process.env.NUXT_PUBLIC_AE_AUTH_URL,
      aeLoginUrl: process.env.NUXT_PUBLIC_AE_LOGIN_URL,
      aeAppUrl: process.env.NUXT_PUBLIC_AE_APP_URL,
      aeAdminUrl: process.env.NUXT_PUBLIC_AE_ADMIN_URL,
      aeMonitoringUrl: process.env.NUXT_PUBLIC_AE_MONITORING_URL,
      aeWebsiteUrl: process.env.NUXT_PUBLIC_AE_WEBSITE_URL,
      nodeEnv: process.env.NUXT_PUBLIC_NODE_ENV,
      logLevel: process.env.NUXT_PUBLIC_LOG_LEVEL,
      posthogKey: process.env.NUXT_PUBLIC_POSTHOG_KEY,
      posthogUrl: process.env.NUXT_PUBLIC_POSTHOG_URL,
      studioTokens: process.env.NUXT_PUBLIC_STUDIO_TOKENS,
      scraperUrl: process.env.NUXT_PUBLIC_SCRAPER_URL,
      devHelper: {
        enabled: true,
        features: {
          networkErrorClassifier: true,
          infiniteLoopDetector: true,
          unhandledPromiseRejectionTracker: true,
          environmentConsistencyChecker: true,
        },
      },
    },
    strapiUrl: process.env.NUXT_STRAPI_URL,
    supabaseServiceKey: process.env.NUXT_SUPABASE_SERVICE_KEY,
    googleApiKey: process.env.NUXT_GOOGLE_API_KEY,
    nasaApiKey: process.env.NUXT_NASA_API_KEY,
    openaiApiKey: process.env.NUXT_OPENAI_API_KEY,
    openaiOrg: process.env.NUXT_OPENAI_ORG,
    redisFlushKey: process.env.NUXT_REDIS_FLUSH_KEY,
    scraperKey: process.env.NUXT_SCRAPER_KEY,
    razorpayKey: process.env.NUXT_RAZORPAY_KEY,
    razorpaySecret: process.env.NUXT_RAZORPAY_SECRET,
    razorpayTestKey: process.env.NUXT_RAZORPAY_TEST_KEY,
    razorpayTestSecret: process.env.NUXT_RAZORPAY_TEST_SECRET,
  },
})
