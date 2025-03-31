import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { defineNuxtConfig } from 'nuxt/config'
import AuraTheme from '../../shared/theme'
import { devPortMap } from '../../shared/paths.config'
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
  'posthogKey',
  'posthogURL',
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

export default defineNuxtConfig({
  extends: [
    '../../layers/base',
    '../../layers/supabase',
    '../../layers/crud',
    '../../layers/advert',
    '../../layers/referral',
  ],

  modules: [
    '@nuxt/devtools',
    '@vueuse/nuxt',
    '@nuxt/content',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
  ],

  ssr: false,

  runtimeConfig: {
    serviceName: 'auth',
    ...pick(env.private, [...privateKeys]),
    public: {
      serviceName: 'auth',
      ...pick(env.public, [...publicKeys]),
    },
  },

  srcDir: '.',
  workspaceDir: '../../',

  devServer: {
    host: 'localhost',
    port: process.env.NUXT_MULTI_APP ? devPortMap.admin : 3000,
  },

  compatibilityDate: '2025-01-10',

  nitro: {
    experimental: {
      websocket: true,
      asyncContext: true,
    },
    rollupConfig: {
      external: [
        'winston',
        'winston-transport',
        'util',
        'os',
        'fs',
        'path',
        'zlib',
        'http',
        'https',
      ],
    },
  },

  primevue: {
    autoImport: true,
    components: {
      include: '*',
      prefix: 'Prime',
      exclude: ['Galleria', 'Carousel', 'Editor'],
    },
    options: {
      ripple: true,
      inputVariant: 'filled',
      theme: AuraTheme,
    },
  },

  supabase: {
    url: process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_KEY,
    serviceKey: process.env.NUXT_SUPABASE_SERVICE_KEY,
  },

  tailwindcss: {
    configPath: `${currentDir}/tailwind.config.ts`,
    cssPath: [`${currentDir}/assets/css/tailwind.css`, { injectPosition: 0 }],
    exposeConfig: true,
    viewer: true,
  },
})
