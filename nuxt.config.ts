// https://v3.nuxtjs.org/api/configuration/nuxt.config

import { MODULE_OPTIONS, MODULES } from './modules.config'

const og = {
  title: 'AstronEra: Your Gateway to the Stars',
  description:
    'Connect, learn, and unravel the cosmos with astronomers and space enthusiasts from around the globe',
  image: '/astronera-logo-with-text.jpg',
  url: 'https://astronera.com'
}

// const authExclude =
//   '',
//     ? ['/*']
//     : ['/', '/auth/*', '/contact', '/about', '/team/*', '/team']

export default defineNuxtConfig({
  // routeRules: {
  //   '/auth/**': {
  //     swr: 60 * 60
  //   }
  // },
  nitro: {
    // Production
    storage: {
      data: {
        driver: 'vercelKV',
        base: 'astrotribe:'
      }
    },
    // Development
    devStorage: {
      data: {
        driver: 'fs',
        base: './data/kv'
      },
      blogs: {
        driver: 'fs',
        base: './data/blogs'
      }
    }
  },
  ui: {
    icons: ['mdi', 'heroicons', 'material-symbols']
  },
  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' },
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      link: [{ rel: 'icon', href: '/favicon.ico', sizes: 'any' }],
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
      ]
      // script: [
      // Insert your Google Tag Manager Script here
      // { src: 'https://browser.sentry-cdn.com/7.28.1/bundle.min.js', async: true, type: 'text/partytown' },
      //   ]
    }
  },
  css: [],
  imports: {
    dirs: ['stores', 'data']
  },
  colorMode: {
    classSuffix: ''
  },
  modules: MODULES,
  ...MODULE_OPTIONS,

  devtools: {
    enabled: true,
    // inclued vscode to enable element selection to open vscode related file
    vscode: {}
  },

  runtimeConfig: {
    // Keys within public, will be also exposed to the client-side
    public: {
      baseUrl: '',
      testMode: '',
      posthogKey: '',
      supabaseUrl: '',
      supabaseKey: '',
      testingUserame: '',
      testingPassword: '',
    },
    // The private keys which are only available within server-side
    adminEmails: '',
    supabaseServiceKey: '',
    nasaApiKey: '',
    openaiApiKey: '',
    openaiOrg: '',
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
  image: {
    format: ['webp', 'jpg']
  },
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
  ssr: true
})
