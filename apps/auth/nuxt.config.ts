import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { defineNuxtConfig } from 'nuxt/config'
import { config } from 'dotenv'
import { sharedRuntimeConfig } from '../../shared/runtime.config'
import { devPortMap } from '../../shared/paths.config'

// Load environment variables from the root .env file
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') })

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  extends: [
    '../../layers/logging',
    '../../layers/base',
    '../../layers/supabase',
    '../../layers/crud',
    '../../layers/referral',
  ],

  modules: [
    '@nuxt/devtools',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
    [
      '@nuxtjs/supabase',
      {
        redirect: false,
        url: process.env.NUXT_PUBLIC_SUPABASE_URL,
        key: process.env.NUXT_PUBLIC_SUPABASE_KEY,
        clientOptions: {
          auth: {
            flowType: 'pkce',
            detectSessionInUrl: true,
            persistSession: true,
            autoRefreshToken: true,
          },
        },
        cookieOptions: {
          domain: process.env.NODE_ENV === 'production' ? 'astronera.org' : 'localhost',
          maxAge: 60 * 60 * 8,
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production' ? true : false,
        },
        cookieName: 'sb',
      },
    ],
  ],

  ssr: false,

  runtimeConfig: {
    serviceName: 'auth',
    ...sharedRuntimeConfig.runtimeConfig.private,
    public: {
      serviceName: 'auth',
      ...sharedRuntimeConfig.runtimeConfig.public,
    },
  },
  srcDir: '.',
  workspaceDir: '../../',

  build: {
    transpile: ['../../layers/base', '../../layers/supabase', 'primevue'],
  },

  routeRules: {
    '/': { redirect: '/login' },
  },

  devServer: {
    host: 'localhost',
    port: process.env.NUXT_MULTI_APP ? devPortMap.auth : 3009,
  },

  compatibilityDate: '2024-10-03',

  vite: {
    optimizeDeps: {
      include: ['primevue/ripple'],
    },
  },

  primevue: {
    components: {
      include: '*',
      prefix: 'Prime',
      exclude: ['Galleria', 'Carousel', 'Editor'],
    },
  },
})
