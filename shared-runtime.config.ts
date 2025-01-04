import { config } from 'dotenv'

config()

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      turnstileSiteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY,
      formbricksEnvironment: process.env.NUXT_PUBLIC_FORMBRICKS_ENVIRONMENT,
      formbricksHost: process.env.NUXT_PUBLIC_FORMBRICKS_HOST,
      supabaseURL: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY,
      // App URLS
      strapiURL: process.env.NUXT_PUBLIC_STRAPI_URL,
      authURL: process.env.NUXT_PUBLIC_AUTH_URL,
      loginURL: process.env.NUXT_PUBLIC_LOGIN_URL,
      appURL: process.env.NUXT_PUBLIC_APP_URL,
      apiURL: process.env.NUXT_PUBLIC_API_URL,
      adminURL: process.env.NUXT_PUBLIC_ADMIN_URL,
      monitoringURL: process.env.NUXT_PUBLIC_MONITORING_URL,
      websiteURL: process.env.NUXT_PUBLIC_WEBSITE_URL,
      scraperURL: process.env.NUXT_PUBLIC_SCRAPER_URL,
      //
      nodeEnv: process.env.NODE_ENV,
      logLevel: process.env.NUXT_PUBLIC_LOG_LEVEL,
      posthogKey: process.env.NUXT_PUBLIC_POSTHOG_KEY,
      posthogURL: process.env.NUXT_PUBLIC_POSTHOG_URL,
      studioTokens: process.env.NUXT_PUBLIC_STUDIO_TOKENS,
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
    private: {
      resendApiKey: process.env.NUXT_RESEND_API_KEY,
      strapiURL: process.env.NUXT_STRAPI_URL,
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
      turnstileSecretKey: process.env.NUXT_TURNSTILE_SECRET_KEY,
    },
  },
})
