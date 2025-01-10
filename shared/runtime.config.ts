import { config } from 'dotenv'
import { devPortMap } from './paths.config'

config()

const localHost = (port: string | number) => `http://localhost:${port}`

export const sharedRuntimeConfig = defineNuxtConfig({
  runtimeConfig: {
    public: {
      turnstileSiteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY,
      formbricksEnvironment: process.env.NUXT_PUBLIC_FORMBRICKS_ENVIRONMENT,
      formbricksHost: process.env.NUXT_PUBLIC_FORMBRICKS_HOST,
      supabaseURL: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY,
      // App URLS
      loginURL: process.env.NUXT_PUBLIC_LOGIN_URL,
      strapiURL: process.env.NUXT_PUBLIC_STRAPI_URL ?? localHost(devPortMap.cms),
      authURL: process.env.NUXT_PUBLIC_AUTH_URL ?? localHost(devPortMap.auth),
      appURL: process.env.NUXT_PUBLIC_APP_URL ?? localHost(devPortMap.app),
      apiURL: process.env.NUXT_PUBLIC_API_URL ?? localHost(devPortMap.api),
      adminURL: process.env.NUXT_PUBLIC_ADMIN_URL ?? localHost(devPortMap.admin),
      monitoringURL: process.env.NUXT_PUBLIC_MONITORING_URL ?? localHost(devPortMap.monitoring),
      websiteURL: process.env.NUXT_PUBLIC_WEBSITE_URL ?? localHost(devPortMap.website),
      scraperURL: process.env.NUXT_PUBLIC_SCRAPER_URL ?? localHost(devPortMap.scraper),
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
      strapiURL: process.env.NUXT_STRAPI_URL ?? localHost(devPortMap.cms),
      resendApiKey: process.env.NUXT_RESEND_API_KEY,
      supabaseServiceKey: process.env.NUXT_SUPABASE_SERVICE_KEY,
      googleApiKey: process.env.NUXT_GOOGLE_API_KEY,
      nasaApiKey: process.env.NUXT_NASA_API_KEY,
      apiSecretKey: process.env.API_SECRET_KEY ?? 12345,
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
