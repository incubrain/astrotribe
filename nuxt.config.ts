// https://v3.nuxtjs.org/api/configuration/nuxt.config

import path from 'path'
import { maxHeaderSize } from 'http'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import generateRoutes from './scripts/generate-lazy-routes'
import { MODULE_OPTIONS, MODULES, DEV_MODULE_OPTIONS } from './modules.config'

const og = {
  title: 'AstronEra: Your Gateway to the Stars',
  description:
    'Connect, learn, and unravel the cosmos with astronomers and space enthusiasts from around the globe',
  image: '/astronera-logo-with-text.jpg',
  url: 'https://www.astronera.org',
}

export default defineNuxtConfig({
  // UNCOMMENT FOR DEBUGGING

  webpack: {
    terser: {
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
  },
  // debug: false,
  // sourcemap: {
  //   server: false,
  //   client: false,
  // },
  build: {
    transpile: ['primevue'],
    splitChunks: {
      layouts: true,
      pages: true,
      commons: true,
      components: true,
      composables: true,
      plugins: true,
      financials: true,
      server: true,
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        automaticNameDelimiter: '.',
        name: undefined,
        cacheGroups: {
          components: {
            test: /\/(components|composables)\//,
            name: 'components',
            chunks: 'all',
            enforce: true,
          },
          financials: {
            test: /\/financials\//,
            name: 'financials',
            chunks: 'all',
            enforce: true,
          },
          server: {
            test: /\/server\//,
            name: 'server',
            chunks: 'all',
            enforce: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
            priority: -10,
          },
        },
      },
    },
  },
  experimental: {
    // https://nuxt.com/docs/guide/going-further/experimental-features
    // cookieStore: true,
    // viewTransition: true,
    // typedPages: true,
    // sharedPrerenderData: true,
    inlineRouteRules: true,
    asyncContext: true,
  },

  routeRules: {
    '/astrotribe/**': { ssr: false },
  },

  hooks: {
    'pages:extend'(pages) {
      const generatedRoutes = generateRoutes(path.join(__dirname, 'pages'))
      pages.push(...generatedRoutes)
    },
  },

  pages: {
    index: {
      lazy: false,
    },
  },

  nitro: {
    preset: 'node-server',
    experimental: {
      websocket: true,
      watcher: 'parcel',
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

  site: {
    url: og.url,
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
        { src: 'https://www.youtube.com/iframe_api', async: true, type: 'text/partytown' },
      ],
    },
  },

  css: ['swiper/element/css/autoplay', 'swiper/element/css/grid'],

  vue: {
    compilerOptions: {
      isCustomElement: (tag) =>
        ['swiper-container', 'swiper-slide', 'swiper-wrapper'].includes(tag),
    },
  },

  imports: {
    dirs: ['composables/**'],
  },

  modules: MODULES,
  ...MODULE_OPTIONS,

  $development: {
    ...DEV_MODULE_OPTIONS,
  },

  devtools: {
    enabled: true,

    // inclued vscode to enable element selection to open vscode related file
    vscode: {},

    timeline: {
      enabled: true,
    },
  },

  runtimeConfig: {
    // client
    public: {
      nodeEnv: process.env.NODE_ENV,
      logLevel: '',
      posthogKey: '',
      posthogUrl: '',
      studioTokens: '',
      supabaseUrl: '',
      supabaseKey: '',
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
    // server
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

  typescript: {
    shim: true,
    tsConfig: {
      exclude: ['node_modules', 'dist', 'theme', 'types'],
      compilerOptions: {
        strict: true,
      },
    },
  },

  ssr: true,

  compatibilityDate: '2024-09-10',
})
