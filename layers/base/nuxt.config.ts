import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { defineNuxtConfig } from 'nuxt/config'

const currentDir = dirname(fileURLToPath(import.meta.url))

function generateLocalUrls(start = 3000, end = 3009) {
  return Array.from({ length: end - start + 1 }, (_, i) => `http://localhost:${start + i}`)
}

const localUrls = generateLocalUrls()

export default defineNuxtConfig({
  workspaceDir: '../../',
  modules: [
    '@nuxt/devtools',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    'nuxt-security',
    '@nuxtjs/supabase',
    '@primevue/nuxt-module',
  ],

  primevue: {
    importPT: { from: resolve(currentDir, './theme/index.js') },
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
          cssLayer: false,
        },
      },
    },
  },

  css: [resolve(currentDir, './assets/css/tailwind.css')],

  image: {
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
  },

  icon: {
    serverBundle: {
      collections: ['material-symbols', 'mdi'],
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
    nonce: true,
    removeLoggers: false,
    ssg: false,
    sri: false,
  },

  eslint: {
    checker: true,
  },

  components: [
    {
      path: './components',
      pathPrefix: false,
      prefix: 'IB',
      global: true,
    },
  ],

  supabase: {
    redirect: false,
    clientOptions: {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    },
    cookieName: 'sb',
  },

  nitro: {
    preset: 'node-server',
    experimental: {
      websocket: true,
    },
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    storage: {
      session: {
        driver: 'memory',
      },
    },
  },

  vite: {
    optimizeDeps: {
      exclude: ['fsevents'],
    },
  },

  build: {
    transpile: ['@vueuse/integrations', '@vueuse/core', 'primevue'],
    // optimization: {
    //   splitChunks: {
    //     chunks: 'all',
    //     automaticNameDelimiter: '.',
    //     name: undefined,
    //     cacheGroups: {
    //       components: {
    //         test: /\/(components|composables)\//,
    //         name: 'components',
    //         chunks: 'all',
    //         enforce: true,
    //       },
    //       financials: {
    //         test: /\/financials\//,
    //         name: 'financials',
    //         chunks: 'all',
    //         enforce: true,
    //       },
    //       server: {
    //         test: /\/server\//,
    //         name: 'server',
    //         chunks: 'all',
    //         enforce: true,
    //       },
    //       vendor: {
    //         test: /[\\/]node_modules[\\/]/,
    //         name: 'vendor',
    //         chunks: 'all',
    //         priority: -10,
    //       },
    //     },
    //   },
    // },
  },
  typescript: {
    shim: true,
    tsConfig: {
      exclude: ['node_modules', 'dist', 'theme', 'types'],
      compilerOptions: {
        strict: true,
      },
    },
  },
  devtools: {
    enabled: true,
    vscode: {},

    timeline: {
      enabled: true,
    },
  },

  runtimeConfig: {
    public: {
      authUrl: 'http://localhost:3009',
      loginUrl: 'http://localhost:3009/login',
      // client
      nodeEnv: process.env.NODE_ENV,
      logLevel: '',
      posthogKey: '',
      posthogUrl: '',
      studioTokens: '',
      scraperUrl: '',
      devHelper: {
        enabled: process.env.NUXT_PUBLIC_IB_DEVEX === 'true',
        features: {
          networkErrorClassifier: true,
          infiniteLoopDetector: true,
          unhandledPromiseRejectionTracker: true,
          environmentConsistencyChecker: true,
        },
      },
    },
    googleApiKey: '',
    supabaseServiceKey: '',
    nasaApiKey: '',
    openaiApiKey: '',
    openaiOrg: '',
    redisFlushKey: '',
    scraperKey: '',
    razorpayKey: '',
    razorpaySecret: '',
    razorpayTestKey: '',
    razorpayTestSecret: '',
  },
})
