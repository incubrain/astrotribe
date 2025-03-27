import { getSharedEnv, pick } from '../../shared/env'

const env = getSharedEnv()

const publicKeys = [
  'supabaseURL',
  'supabaseKey',
  'appURL',
  'apiURL',
  'websiteURL',
  'scraperURL',
  'devHelper',
] as const
const privateKeys = [
  'resendApiKey',
  'supabaseServiceKey',
  'googleApiKey',
  'scraperKey',
  'razorpayKey',
  'razorpaySecret',
] as const

export default defineNuxtConfig({
  modules: ['@nuxtjs/supabase'],

  $meta: {
    name: 'crud',
  },

  runtimeConfig: {
    serviceName: 'crud',
    ...pick(env.private, [...privateKeys]),
    public: {
      serviceName: 'crud',
      ...pick(env.public, [...publicKeys]),
    },
  },

  supabase: {
    url: process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_KEY,
    serviceKey: process.env.NUXT_SUPABASE_SERVICE_KEY,
    redirect: false,
  },
})
