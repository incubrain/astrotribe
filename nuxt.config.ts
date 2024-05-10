// https://v3.nuxtjs.org/api/configuration/nuxt.config

import { MODULE_OPTIONS, MODULES, DEV_MODULE_OPTIONS } from './modules.config'

const og = {
  title: 'AstronEra: Your Gateway to the Stars',
  description:
    'Connect, learn, and unravel the cosmos with astronomers and space enthusiasts from around the globe',
  image: '/astronera-logo-with-text.jpg',
  url: 'https://astronera.com'
}

export default defineNuxtConfig({
  experimental: {
    // https://nuxt.com/docs/guide/going-further/experimental-features
    // cookieStore: true,
    // viewTransition: true,
    // typedPages: true,
    // sharedPrerenderData: true,
    inlineRouteRules: true,
    asyncContext: true
  },

  routeRules: {
    '/astrotribe/**': { ssr: false }
  },
  nitro: {
    experimental: {
      tasks: true
    },
    storage: {
      session: {
        driver: 'memory'
      },
      companies: {
        driver: 'fs',
        base: './data/db'
      }
    },
    scheduledTasks: {
      // every 12 hours
      '0 */2 * * *': ['scrape:news']
      // '*/50 * * * *': ['scrape:papers']
    }
  },

  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        {
          id: 'theme-link',
          rel: 'stylesheet',
          href: '/themes/aura-dark-teal/theme.css'
        }
      ],
      htmlAttrs: {
        lang: 'en'
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
        { name: 'twitter:image', content: og.image }
      ],
      script: [
        // Insert your Google Tag Manager Script here
        // { src: 'https://browser.sentry-cdn.com/7.28.1/bundle.min.js', async: true, type: 'text/partytown' },
        { src: 'https://www.youtube.com/iframe_api', async: true, type: 'text/partytown' }
      ]
    }
  },
  css: ['swiper/element/css/autoplay', 'swiper/element/css/grid'],

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ['swiper-container', 'swiper-slide', 'swiper-wrapper'].includes(tag)
    }
  },

  imports: {
    dirs: ['composables/**']
  },

  modules: MODULES,
  ...MODULE_OPTIONS,

  $development: {
    ...DEV_MODULE_OPTIONS
  },

  devtools: {
    enabled: true,

    // inclued vscode to enable element selection to open vscode related file
    vscode: {},

    timeline: {
      enabled: true
    }
  },

  runtimeConfig: {
    // client
    public: {
      nodeEnv: process.env.NODE_ENV,
      logLevel: '',
      posthogKey: '',
      studioTokens: '',
      supabaseUrl: '',
      supabaseKey: ''
    },
    // server
    googleApiKey: '',
    supabaseServiceKey: '',
    nasaApiKey: '',
    openaiApiKey: '',
    openaiOrg: ''
  },

  typescript: {
    shim: false,
    tsConfig: {
      exclude: ['node_modules', 'dist'],
      compilerOptions: {
        strict: true
      }
    }
  },

  ssr: true
})
