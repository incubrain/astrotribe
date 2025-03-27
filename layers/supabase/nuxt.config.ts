import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { defineNuxtConfig } from 'nuxt/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import { getSharedEnv, pick } from '../../shared/env'

console.log('NUXT_PUBLIC_SUPABASE_URL:', process.env.NUXT_PUBLIC_SUPABASE_URL)

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

const currentDir = dirname(fileURLToPath(import.meta.url))

console.log('Node Env:', process.env.NODE_ENV)

export default defineNuxtConfig({
  modules: ['@nuxtjs/supabase'],

  $meta: {
    name: 'supabase',
  },

  runtimeConfig: {
    serviceName: 'crud',
    ...pick(env.private, [...privateKeys]),
    public: {
      serviceName: 'crud',
      ...pick(env.public, [...publicKeys]),
    },
  },

  srcDir: '.',
  workspaceDir: '../../',

  supabase: {
    url: process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_KEY,
    serviceKey: process.env.NUXT_SUPABASE_SERVICE_KEY,
    redirect: false,
    clientOptions: {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    },
    cookieOptions: {
      domain:
        process.env.NODE_ENV === 'production'
          ? 'astronera.org' // This will work for all subdomains
          : 'localhost',
      maxAge: 60 * 60 * 8,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production' ? true : false,
    },
    cookiePrefix: 'sb', // Updated from cookieName which is deprecated
  },
})
