import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { sharedRuntimeConfig } from '../../shared/runtime.config'
import { devPortMap } from '../../shared/paths.config'

const currentDir = dirname(fileURLToPath(import.meta.url))

function generateLocalUrls(start = 3000, end = 3009) {
  return Array.from({ length: end - start + 1 }, (_, i) => `http://localhost:${start + i}`)
}

const localUrls = generateLocalUrls()

const og = {
  title: 'AstronEra: Your Gateway to the Stars',
  description:
    'Connect, learn, and unravel the cosmos with astronomers and space enthusiasts from around the globe',
  image: '/astronera-logo-with-text.jpg',
  url: 'https://www.astronera.org',
}

export default defineNuxtConfig({
  extends: [
    '../../layers/base',
    '../../layers/crud',
    '../../layers/advert',
    '../../layers/referral',
  ],

  modules: [
    '@nuxtjs/mdc',
    'nuxt-security',
    '@nuxtjs/seo',
    '@nuxt/devtools',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
    '@nuxt/content',
    '@nuxthq/studio',
  ],

  ssr: true,

  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      link: [{ rel: 'icon', href: '/favicon.ico', sizes: 'any' }],
      htmlAttrs: { lang: 'en' },
      meta: [
        { property: 'title', content: og.description },
        { property: 'description', content: og.description },
        { property: 'og:title', content: og.title },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: og.image },
        { property: 'og:description', content: og.description },
        { property: 'og:url', content: og.url },
        { name: 'twitter:card', content: 'Twitter Card' },
        { name: 'twitter:title', content: og.title },
        { name: 'twitter:description', content: og.description },
        { name: 'twitter:image', content: og.image },
      ],
      script: [
        // Insert your Google Tag Manager Script here
        // { src: 'https://browser.sentry-cdn.com/7.28.1/bundle.min.js', async: true, type: 'text/partytown' },
        { src: 'https://www.youtube.com/iframe_api', async: true },
      ],
    },
  },

  site: { url: og.url, name: 'AstronEra', description: 'Astronomy Hub', defaultLocale: 'en' },

  content: {
    // Enable Studio preview
    preview: {
      dev: true,
      api: 'https://api.nuxt.studio',
    },
    highlight: { theme: { default: 'github-dark', light: 'github-light', dark: 'github-dark' } },
    // Database configuration if needed for serverless
    database: {
      type: 'sqlite', // Default, change if deploying to serverless
      filename: '.data/content/contents.sqlite',
    },
  },

  runtimeConfig: {
    serviceName: 'website',
    ...sharedRuntimeConfig.runtimeConfig.private,
    public: { serviceName: 'website', ...sharedRuntimeConfig.runtimeConfig.public },
  },
  srcDir: '.',
  workspaceDir: '../../',

  build: {
    transpile: [
      'embla-carousel-vue',
      'embla-carousel-autoplay',
      'embla-carousel-auto-scroll',
      'gsap',
    ],
  },

  routeRules: {
    '/': { prerender: true },
    '/blog': { prerender: true },
    '/blog/category/*': {
      isr: 3600, // Cache for 1 hour
      swr: true, // Stale-while-revalidate
    },
    '/blog/category/*/page/*': {
      isr: 3600, // Cache for 1 hour
      swr: true, // Stale-while-revalidate
    },
    '/blog/*': {
      // Individual article routes
      isr: 3600,
      swr: true,
    },

    '/sitemap.xml': {
      headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'max-age=3600' },
    },
    '/api/__sitemap__/**': { cors: true, headers: { 'Cache-Control': 'max-age=3600' } },
  },

  devServer: { host: 'localhost', port: process.env.NUXT_MULTI_APP ? devPortMap.website : 3000 },

  experimental: { inlineRouteRules: true, asyncContext: true },

  compatibilityDate: '2024-09-22',

  nitro: { prerender: { routes: ['/sitemap.xml'], crawlLinks: true, failOnError: false } },

  fonts: {
    families: [
      { name: 'Orbitron', provider: 'google' },
      { name: 'Source Code Pro', provider: 'google' },
    ],
  },

  image: {
    format: ['webp', 'jpg', 'png'],
    quality: 80,
    dir: 'public',
    domains: ['astronera.org', 'cms.astronera.org', 'staging.cms.astronera.org', 'localhost'],
    fallback: '/defaults/fallback.jpg',

    // cms provider configuration
    cms: { baseURL: `${process.env.NUXT_PUBLIC_CMS_URL}/uploads/` },

    // You can keep the ipx provider as a fallback or for local development
    ipx: {
      maxAge: 60 * 60 * 24 * 365, // 1 year (in seconds)
    },
  },

  primevue: {
    importPT: { from: resolve(currentDir, '../../theme/index.js') },
    autoImport: true,
    components: { prefix: 'Prime', include: '*', exclude: ['Editor'] },

    //   composables: {
    //     include: '*',
    //   },

    options: {
      ripple: true,
      unstyled: true,
      theme: {
        options: {
          cssLayer: { name: 'primevue', order: 'tailwind-base, primevue, tailwind-utilities' },
        },
      },
    },
  },

  security: {
    headers: {
      contentSecurityPolicy: {
        'worker-src': ["'self'", 'blob:'],
        'frame-ancestors': "'self' https://astronera.org", // Allow embedding only from your domain
        'default-src': [
          "'self'",
          ...localUrls,
          'http://localhost:3000',
          'http://localhost:54321',
          'https://www.astronera.org',
          'https://*.up.railway.app',
          'https://*.supabase.co',
          'https://*.posthog.com',
        ],
        'connect-src': [
          "'self'",
          ...localUrls,
          'http://localhost:3000',
          'http://localhost:8080',
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
          'ws://localhost:4001', // Add this line
          'wss://localhost:4001',
          'https://picsum.photos',
          'https://cms.astronera.org',
          'https://astronera.org',
          'https://*.astronera.org',
          'http://localhost:1337/',
        ],
        'img-src': [
          "'self'",
          'data:',
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
        ],
        'script-src': [
          "'self'",
          "'unsafe-inline'",
          "'wasm-unsafe-eval'",
          'http://localhost:3000',
          'http://localhost:54321',
          'https://www.youtube.com',
          'https://s.ytimg.com',
          'https://www.google.com/maps',
          'https://*.betterstack.com',
          'https://*.razorpay.com',
          'https://*.posthog.com',
          'https://us.i.posthog.com',
        ],
        'script-src-attr': ["'unsafe-inline'"],
        'style-src': [
          "'self'",
          "'unsafe-inline'",
          'https://fonts.googleapis.com',
          'https://*.posthog.com',
        ],
        'frame-src': [
          "'self'",
          'https://www.youtube.com',
          'https://us.i.posthog.com',
          'https://*.posthog.com',
          'https://www.google.com',
          'https://*.astronera.org',
          'https://*.betterstack.com',
          'https://*.razorpay.com',
        ],
        'child-src': ["'self'", 'https://us.i.posthog.com', 'https://*.posthog.com'],
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

  sitemap: {
    // Exclude default app sources since we're handling routes manually
    excludeAppSources: true,

    // Enable caching for better performance
    cacheMaxAgeSeconds: 3600, // 1 hour

    // Split into multiple sitemaps for better organization
    sitemaps: { blog: { sources: ['/api/__sitemap__/blog'] } },

    // Only prerender sitemap in production
    defaults: {
      // We don't need these as per best practices
      // changefreq: 'daily',
      // priority: 0.8,
    },

    // Enable experimental features for better performance
    experimentalCompression: true,
    experimentalWarmUp: true,
  },

  tailwindcss: {
    configPath: `${currentDir}/tailwind.config.ts`,
    cssPath: [`${currentDir}/assets/css/tailwind.css`, { injectPosition: 0 }],
    exposeConfig: true,
    viewer: true,
  },
})