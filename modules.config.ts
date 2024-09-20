import path from 'path'
import type { ModuleOptions, NuxtConfig } from '@nuxt/schema'

export const MODULES: NuxtConfig['modules'] = [
  // '@nuxtjs/partytown',
  // '@nuxt/eslint',
  '@nuxt/devtools',
  '@vueuse/nuxt',
  '@nuxt/image',
  '@pinia/nuxt',
  '@nuxt/icon',
  '@nuxtjs/seo',
  '@nuxt/content',
  '@primevue/nuxt-module',
  '@nuxtjs/tailwindcss',
  '@nuxtjs/color-mode',
  '@nuxtjs/supabase',
  'nuxt-security',
  'nuxt-tiptap-editor',
]

const TIP_TAP_OPTIONS: NuxtConfig['tiptap'] = {
  prefix: 'Tiptap',
}

const ESLINT_OPTIONS: NuxtConfig['eslint'] = {
  checker: true,
}

// !infra:med:hard:12 - look into and configure nuxt security module
// https://nuxt-security.vercel.app/documentation/getting-started/configuration
const SECURITY_OPTIONS: NuxtConfig['security'] = {
  headers: {
    contentSecurityPolicy: {
      'worker-src': ["'self'", 'blob:'],
      'default-src': [
        "'self'",
        'http://localhost:3000',
        'http://localhost:54321',
        'https://www.astronera.org',
        'https://*.up.railway.app',
        'https://*.supabase.co',
        'https://*.posthog.com',
      ],
      'connect-src': [
        "'self'",
        'http://localhost:3000',
        'http://localhost:8080',
        'http://host.docker.internal:8080',
        'http://localhost:54321',
        'https://o1175094.ingest.sentry.io',
        'https://api.iconify.design',
        'https://api.unisvg.com',
        'https://api.simplesvg.com',
        'ws://localhost:4000',
        'https://*.supabase.co',
        'https://*.up.railway.app',
        'http://*.railway.internal',
        'http://scrapers.railway.internal:8080',
        'https://*.razorpay.com',
        'https://*.posthog.com',
        'https://us.i.posthog.com',
      ],
      'img-src': [
        "'self'",
        'data:',
        'http://localhost:54321',
        'http://localhost:3000',
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
      ],
      'script-src': [
        "'self'",
        "'nonce-{{nonce}}'",
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
      'http://localhost:3000',
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
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-client-info', 'apikey'],
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
  nonce: true,
  removeLoggers: false,
  ssg: false,
  sri: false,
}

const SEO_OPTIONS: NuxtConfig['seo'] = {
  redirectToCanonicalSiteUrl: true,
}

const ICON_OPTIONS: NuxtConfig['icon'] = {
  serverBundle: {
    collections: ['material-symbols', 'mdi'],
  },
}

const OG_IMAGE_OPTIONS: NuxtConfig['ogImage'] = {
  componentOptions: {
    global: true,
  },
}

const CONTENT_OPTIONS: NuxtConfig['content'] = {
  highlight: {
    theme: {
      // !todo: light theme not working ??
      default: 'github-light',
      light: 'github-light',
      dark: 'github-dark',
    },
  },
  markdown: {
    remarkPlugins: ['remark-mermaid'],
  },
}

const PRIMEVUE_OPTIONS: NuxtConfig['primevue'] = {
  importPT: { from: path.resolve(__dirname, './theme/index.js') },
  components: {
    prefix: 'Prime',
    exclude: ['Editor'],
  },

  options: {
    ripple: true,
    unstyled: true,
    theme: {
      options: {
        cssLayer: false,
      },
    },
  },
}

const IMAGE_OPTIONS: NuxtConfig['image'] = {
  format: ['webp', 'jpg'],
  // image: {
  //   domains: ["dohemiycqebeipbvsvnr.supabase.co"],
  //   presets: {
  //     cover: {
  //       modifiers: {
  //         format: "jpg",
  //         quality: 80,
  //         sizes: "sm:100vw md:50vw lg:800px",
  //       },
  //     },
  //     card: {
  //       modifiers: {
  //         format: "jpg",
  //         quality: 70,
  //         sizes: "sm:100vw md:40vw lg:300px",
  //       },
  //     },
  //   },
  // },
}

const COLOR_MODE_OPTIONS: NuxtConfig['colorMode'] = {
  classSuffix: '',
}

const SUPABASE_OPTIONS: NuxtConfig['supabase'] = {
  redirectOptions: {
    login: '/auth/login',
    callback: '/auth/confirm',
    include: ['/astrotribe/**'],
    exclude: [],
    cookieRedirect: true,
  },
  clientOptions: {
    auth: {
      flowType: 'pkce',
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true,
    },
  },
  cookieName: 'sb',
}

export const MODULE_OPTIONS: { [key: string]: Partial<ModuleOptions> } = {
  icon: ICON_OPTIONS,
  security: SECURITY_OPTIONS,
  primevue: PRIMEVUE_OPTIONS,
  seo: SEO_OPTIONS,
  ogImage: OG_IMAGE_OPTIONS,
  content: CONTENT_OPTIONS,
  // eslint: ESLINT_OPTIONS,
  image: IMAGE_OPTIONS,
  colorMode: COLOR_MODE_OPTIONS,
  supabase: SUPABASE_OPTIONS,
  tiptap: TIP_TAP_OPTIONS,
}

export const DEV_MODULE_OPTIONS: { [key: string]: Partial<ModuleOptions> } = {}
