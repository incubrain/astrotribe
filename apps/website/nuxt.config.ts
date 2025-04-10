import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import AstroTheme from '../../shared/theme'
import { devPortMap } from '../../shared/paths.config'
import { getSharedEnv, pick } from '../../shared/env'

// Place this at the top of your nuxt.config.ts after importing env
const env = getSharedEnv()

const publicKeys = [
  'supabaseURL',
  'supabaseKey',
  'loginURL',
  'cmsURL',
  'authURL',
  'appURL',
  'apiURL',
  'websiteURL',
  'scraperURL',
  'devHelper',
  'posthogKey',
  'posthogURL',
] as const

const privateKeys = [
  'cmsURL',
  'resendApiKey',
  'resendFromEmail',
  'resendToEmail',
  'supabaseServiceKey',
  'googleApiKey',
  'scraperKey',
  'razorpayKey',
  'razorpaySecret',
] as const

const currentDir = dirname(fileURLToPath(import.meta.url))
const rootDir = join(currentDir, '../..')

const baseLayerPath = resolve(rootDir, 'layers/base')
const crudLayerPath = resolve(rootDir, 'layers/crud')
const referralLayerPath = resolve(rootDir, 'layers/referral')

function generateLocalUrls(start = 3000, end = 3009) {
  return Array.from({ length: end - start + 1 }, (_, i) => `http://localhost:${start + i}`)
}

const localUrls = generateLocalUrls()

const og = {
  title: 'AstronEra: Your Gateway to the Stars',
  description:
    'Connect, learn, and unravel the cosmos with astronomers and space enthusiasts from around the globe',
  image: '/astronera-logo-with-text.jpg',
  url:
    process.env.SITE_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://www.astronera.org'
      : `http://localhost:${process.env.PORT || 3000}`),
}

export default defineNuxtConfig({
  extends: [baseLayerPath, crudLayerPath, referralLayerPath],
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
    '@vueuse/motion/nuxt',
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
    // Studio preview configuration - enhanced for better performance
    preview: {
      api: 'https://api.nuxt.studio',
      gitInfo: {
        name: 'astrotribe',
        owner: 'incubrain',
        url: 'https://github.com/incubrain/astrotribe',
      },
    },

    // Syntax highlighting configuration
    highlight: {
      theme: {
        default: 'github-dark',
        light: 'github-light',
        dark: 'github-dark',
      },
      // Limit languages to only those you need to reduce bundle size
      langs: ['json', 'js', 'ts', 'html', 'css', 'vue', 'bash', 'markdown', 'yaml'],
    },

    // Database configuration optimized for different environments
    database: {
      type: 'postgres',
      url:
        process.env.NUXT_CONTENT_DATABASE_URL ||
        'postgres://postgres:password@localhost:5432/postgres',
      // Ensure schema is properly defined
      schema: 'content', // Using 'content' as schema instead of 'nuxt_content'
      // Add migration options to ensure tables are created
      migration: {
        dir: './database/migrations',
        disableForeignKeys: false,
        autoMigrate: true, // Important: ensures tables are created
      },
      // Connection settings
      pool: {
        min: 2,
        max: 10,
      },
      debug: process.env.NODE_ENV === 'development',
    },

    sources: {
      content: {
        driver: 'fs',
        base: 'content',
      },
    },

    build: {
      // Optimize markdown processing
      markdown: {
        // Streamline TOC for better performance
        toc: {
          depth: 2,
          searchDepth: 2,
        },
        // Disable unnecessary remark plugins
        remarkPlugins: {
          'remark-emoji': false,
          'remark-gfm': {
            // Keep GFM but optimize its options
            singleTilde: false,
          },
        },
        // Optimize rehype plugins
        rehypePlugins: {
          // Disable or configure as needed
        },
      },
      // Optimize path metadata handling for better performance
      pathMeta: {
        forceLeadingSlash: true,
      },
    },

    // Rendering optimization
    renderer: {
      // Limit anchor links to essential headings only
      anchorLinks: { h2: true, h3: true, h4: false, h5: false, h6: false },
    },

    // Content hot reload configuration - optimize for development experience
    watch: {
      enabled: true,
      port: 4000, // Choose a consistent port
      showURL: false, // Reduce console noise
    },
  },

  runtimeConfig: {
    serviceName: 'website',
    ...pick(env.private, [...privateKeys]),
    public: {
      serviceName: 'website',
      ...pick(env.public, [...publicKeys]),
    },
  },

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
    '/sitemap_main.xml': {
      headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'max-age=3600' },
    },
    '/sitemap_blog.xml': {
      headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'max-age=3600' },
    },
    '/sitemap_policies.xml': {
      headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'max-age=3600' },
    },
    '/api/__sitemap__/**': { cors: true, headers: { 'Cache-Control': 'max-age=3600' } },
  },

  devServer: { host: 'localhost', port: process.env.NUXT_MULTI_APP ? devPortMap.website : 3000 },
  future: {
    compatibilityVersion: 4,
  },

  experimental: { inlineRouteRules: true, asyncContext: true },

  compatibilityDate: '2025-03-30',

  nitro: {
    prerender: {
      routes: ['/sitemap.xml', '/sitemap_main.xml', '/sitemap_blog.xml', '/sitemap_policies.xml'],
      crawlLinks: true,
      failOnError: false,
    },
  },

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
    cms: { baseURL: `${process.env.NUXT_PUBLIC_CMS_URL}/uploads/` },
    ipx: {
      maxAge: 60 * 60 * 24 * 365, // 1 year (in seconds)
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

  security: {
    headers: {
      contentSecurityPolicy: {
        'worker-src': ["'self'", 'blob:'],
        'frame-ancestors': "'self' https://astronera.org https://nuxt.studio", // Allow embedding only from your domain
        'default-src': [
          "'self'",
          ...localUrls,
          'http://localhost:3000',
          'http://localhost:54321',
          'https://www.astronera.org',
          'https://*.up.railway.app',
          'https://*.supabase.co',
          'https://*.posthog.com',
          'https://nuxt.studio',
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
          'https://*.nuxt.studio',
        ],
        'script-src-attr': ["'unsafe-inline'"],
        'style-src': [
          "'self'",
          "'unsafe-inline'",
          'https://fonts.googleapis.com',
          'https://*.posthog.com',
          'https://*.nuxt.studio',
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
    excludeAppSources: true,
    cacheMaxAgeSeconds: 1000 * 60 * 60, // 1 hour
    sitemaps: {
      main: { sources: ['/api/__sitemap__/main'] },
      blog: { sources: ['/api/__sitemap__/blog'] },
      policies: { sources: ['/api/__sitemap__/policies'] },
    },
    cacheTTL: 1000 * 60 * 60, // 1 hour
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
