import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { defineNuxtConfig } from 'nuxt/config'
import sharedRuntimeConfig from '../../shared-runtime.config'
import prerenderRoutes from './prerender-routes.json'

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
  workspaceDir: '../../',
  srcDir: '.',

  ssr: true,

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
  ],

  extends: ['../../layers/base'],

  build: {
    transpile: [
      // '../../layers/base',
      'embla-carousel-vue',
      'embla-carousel-autoplay',
      'embla-carousel-auto-scroll',
      'gsap',
    ],
  },

  // routeRules: {
  //   '/': { prerender: true },
  //   '/about': { prerender: true },
  //   '/contact': { prerender: true },
  //   '/team/**': { prerender: true },
  //   '/projects/**': { prerender: true },
  //   '/policies/**': { prerender: true },
  //   '/blog': { isr: true },
  //   '/blog/**': { isr: 60 }, // Revalidate every 60 seconds
  // },

  content: {
    highlight: {
      theme: {
        default: 'github-dark',
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },

  security: {
    headers: {
      contentSecurityPolicy: {
        'worker-src': ["'self'", 'blob:'],
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
      xFrameOptions: 'DENY', // Prevents clickjacking
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
      preflight: {
        statusCode: 204,
      },
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

  nitro: {
    debug: true,
    logLevel: 'debug',
    prerender: {
      crawlLinks: true,
      routes: prerenderRoutes,
    },
  },

  image: {
    format: ['webp', 'jpg', 'png'],
    quality: 80,
    dir: 'public',
    domains: ['astronera.org', 'cms.astronera.org', 'staging.cms.astronera.org', 'localhost'],
    fallback: '/defaults/fallback.jpg',

    // Strapi provider configuration
    strapi: {
      baseURL: `${process.env.NUXT_PUBLIC_STRAPI_URL}/uploads/`, // Adjust this URL to match your Strapi setup
    },

    // You can keep the ipx provider as a fallback or for local development
    ipx: {
      maxAge: 60 * 60 * 24 * 365, // 1 year (in seconds)
    },
  },

  experimental: {
    inlineRouteRules: true,
    asyncContext: true,
  },

  tailwindcss: {
    configPath: `${currentDir}/tailwind.config.ts`,
    cssPath: [`${currentDir}/assets/css/tailwind.css`, { injectPosition: 0 }],
    exposeConfig: true,
    viewer: true,
  },

  primevue: {
    importPT: { from: resolve(currentDir, '../../theme/index.js') },
    autoImport: true,
    components: {
      prefix: 'Prime',
      include: '*',
      exclude: ['Editor'],
    },

    composables: {
      include: '*',
    },

    options: {
      ripple: true,
      unstyled: true,
      theme: {
        options: {
          cssLayer: {
            name: 'primevue',
            order: 'tailwind-base, primevue, tailwind-utilities',
          },
        },
      },
    },
  },
  site: {
    url: og.url,
    name: 'AstronEra',
    description: 'Astronomy Hub',
    defaultLocale: 'en',
  },

  // seo: {
  //   redirectToCanonicalSiteUrl: true,
  // },

  // ogImage: {
  //   componentOptions: {
  //     global: true,
  //   },
  // },

  fonts: {
    families: [
      { name: 'Orbitron', provider: 'google' },
      { name: 'Source Code Pro', provider: 'google' },
    ],
  },

  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      link: [{ rel: 'icon', href: '/favicon.ico', sizes: 'any' }],
      htmlAttrs: {
        lang: 'en',
      },
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
        {
          src: 'https://www.youtube.com/iframe_api',
          async: true,
        },
      ],
    },
  },

  compatibilityDate: '2024-09-22',

  runtimeConfig: {
    public: {
      ...sharedRuntimeConfig.runtimeConfig.public,
    },
  },
})
