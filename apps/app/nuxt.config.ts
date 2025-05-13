import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { defineNuxtConfig } from 'nuxt/config'
import AstroTheme from '../../shared/theme'
import { devPortMap } from '../../shared/paths.config'
import { getSharedEnv, pick } from '../../shared/env'

const env = getSharedEnv()

console.log('Environment Variables', env.public)

function generateLocalUrls(start = 3000, end = 3009) {
  return Array.from({ length: end - start + 1 }, (_, i) => `http://localhost:${start + i}`)
}

const localUrls = generateLocalUrls()

const publicKeys = [
  'turnstileSiteKey',
  'supabaseURL',
  'supabaseKey',
  'loginPath',
  'authURL',
  'apiURL',
  'adminURL',
  'websiteURL',
  'nodeEnv',
  'devHelper',
  'posthogKey',
  'posthogURL',
] as const

const privateKeys = [
  'resendApiKey',
  'supabaseServiceKey',
  'openaiApiKey',
  'openaiOrg',
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
  security: {
    headers: {
      contentSecurityPolicy: {
        'worker-src': ["'self'", 'blob:'],
        'frame-ancestors': "'self' https://astronera.org https://nuxt.studio", // Allow embedding only from your domain
        'default-src': [
          "'self'",
          ...localUrls,
          'http://localhost:3000',
          'http://localhost:3001',
          'http://localhost:54321',
          'https://www.astronera.org',
          'https://astronera.org',
          'https://*.up.railway.app',
          'https://*.supabase.co',
          'https://*.posthog.com',
          'https://nuxt.studio',
          'https://ipapi.co/',
        ],
        'connect-src': [
          ...localUrls,
          "'self'",
          'ws://localhost:3001',
          'wss://localhost:3001',
          'ws://api.astronera.org',
          'wss://api.astronera.org',
          'https:',
          'http://localhost:3000',
          'http://localhost:8080',
          'https://ipapi.co/',
          'http://host.docker.internal:8080',
          'http://localhost:54321',
          'https://o1175094.ingest.sentry.io',
          'https://api.iconify.design',
          'https://api.unisvg.com',
          'https://api.simplesvg.com',
          'https://*.supabase.co',
          'https://*.up.railway.app',
          'http://*.railway.internal',
          'http://scrapers.railway.internal:8080',
          'https://*.razorpay.com',
          'https://*.posthog.com',
          'https://us.i.posthog.com',
          'ws://localhost:4000',
          'wss://localhost:4000',
          'ws://localhost:4001',
          'wss://localhost:4001',
          'https://picsum.photos',
          'https://cms.astronera.org',
          'https://astronera.org',
          'https://*.astronera.org',
          'http://localhost:1337/',
          'wss://api.nuxt.studio',
          'https://api.nuxt.studio',
          'wss://*.nuxt.studio',
          'https://*.nuxt.studio',
        ],
        'img-src': [
          "'self'",
          'data:',
          'https:',
          'https://img-c.udemycdn.com',
          'http://localhost:54321',
          'http://localhost:3000',
          'http://localhost:1337/',
          'https://*.up.railway.app',
          'https://www.nasa.gov',
          'https://science.nasa.gov',
          'https://www.youtube.com',
          'https://s.ytimg.com',
          'https://pbs.twimg.com',
          'https://media.licdn.com',
          'https://*.supabase.co',
          'https://*.posthog.com',
          'https://us.i.posthog.com',
          'http://*.railway.internal',
          'https://picsum.photos',
          'https://fastly.picsum.photos/',
          'https://img.youtube.com',
          'https://cms.astronera.org',
          'https://*.astronera.org',
          'https://*.nuxt.studio',
        ],
        'script-src': [
          "'self'",
          "'unsafe-inline'",
          'https:',
          "'nonce-{{nonce}}'",
          "'unsafe-eval'",
          "'wasm-unsafe-eval'",
          'https://player.vimeo.com',
          'http://localhost:3000',
          'http://localhost:54321',
          'https://www.youtube.com',
          'https://s.ytimg.com',
          'https://www.google.com/maps',
          'https://*.betterstack.com',
          'https://*.razorpay.com',
          'https://*.posthog.com',
          'https://us.i.posthog.com',
          'https://*.nuxt.studio',
        ],
        'script-src-attr': ["'unsafe-inline'"],
        'style-src': [
          "'self'",
          "'unsafe-inline'",
          'https:',
          'https://fonts.googleapis.com',
          'https://*.posthog.com',
          'https://*.nuxt.studio',
        ],
        'frame-src': [
          "'self'",
          'https://www.youtube.com',
          'https://player.vimeo.com',
          'https://us.i.posthog.com',
          'https://*.posthog.com',
          'https://www.google.com',
          'https://*.astronera.org',
          'https://*.betterstack.com',
          'https://*.razorpay.com',
          'https://nuxt.studio',
          'https://*.nuxt.studio',
        ],
        'child-src': [
          "'self'",
          'https://us.i.posthog.com',
          'https://*.posthog.com',
          'https://*.nuxt.studio',
        ],
      },
      xFrameOptions: 'SAMEORIGIN', // Prevents clickjacking
      crossOriginResourcePolicy: 'cross-origin', // Ensures resources are allowed
      crossOriginOpenerPolicy: 'same-origin',
      crossOriginEmbedderPolicy: 'unsafe-none',
    },
    requestSizeLimiter: {
      maxUploadFileRequestInBytes: 2000000, // 2 MB
      throwError: true,
      maxRequestSizeInBytes: 2000000, // 2 MB
    },
    xssValidator: false,
    corsHandler: {
      origin: [
        ...localUrls,
        'http://localhost:3001',
        'http://localhost:8080',
        'http://host.docker.internal:8080',
        'http://*.railway.internal',
        'http://scrapers.railway.internal:8080',
        'http://localhost:54321',
        'https://*.supabase.co',
        'https://us.i.posthog.com',
        'https://*.posthog.com',
      ],
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      allowHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'x-client-info',
        'apikey',
      ],
      exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
      credentials: true,
      maxAge: '86400', // 24 hours in seconds
      preflight: { statusCode: 204 },
    },
    allowedMethodsRestricter: false,
    hidePoweredBy: false,
    basicAuth: false,
    csrf: false,
    nonce: false,
    removeLoggers: false,
    ssg: false,
    sri: false,
  },

  modules: [
    '@nuxt/devtools',
    'nuxt-security',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/mdc',
    '@primevue/nuxt-module',
    '@vite-pwa/nuxt',
    '@nuxt/test-utils/module',
  ],

  imports: {
    dirs: ['stores/**', 'composables/**', 'utils/**'],
  },

  runtimeConfig: {
    serviceName: 'app',
    ...pick(env.private, [...privateKeys]),
    public: {
      serviceName: 'app',
      ...pick(env.public, [...publicKeys]),
    },
  },

  alias: {
    '~/utils': fileURLToPath(new URL('./utils', import.meta.url)),
  },

  devServer: {
    host: 'localhost',
    port: process.env.NUXT_MULTI_APP ? devPortMap.app : 3000,
  },

  future: {
    compatibilityVersion: 4,
  },

  experimental: {
    asyncContext: true,
    // debugModuleMutation: false,
  },

  compatibilityDate: '2025-01-09',

  // Add proper MIME type handling
  nitro: {
    experimental: {
      asyncContext: true,
    },
    routeRules: {
      '/manifest.webmanifest': {
        headers: {
          'Content-Type': 'application/manifest+json',
          'Cache-Control': 'public, max-age=0',
        },
      },
      '/api/bookmarks/**': {
        appMiddleware: ['3-reset-password'],
      },
      '/api/folders/**': {
        appMiddleware: ['3-reset-password'],
      },
      '/api/feeds/**': {
        appMiddleware: ['3-reset-password'],
      },
    },
    alias: {
      '#shared': fileURLToPath(new URL('./shared', import.meta.url)),
    },
  },

  vite: {
    optimizeDeps: {
      exclude: ['fsevents'],
    },
  },

  image: {
    format: ['webp', 'jpg'],
    provider: 'ipx',
    ipx: {
      // Set a valid base URL to avoid initialization issues
      baseURL: '/images',
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
      theme: AstroTheme,
    },
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: false,
    workbox: {
      maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
      navigateFallback: '/offline',
      cleanupOutdatedCaches: true,
      runtimeCaching: [
        {
          urlPattern: /^\/api\//,
          handler: 'NetworkFirst',
        },
      ],
    },
    client: {
      installPrompt: true,
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
