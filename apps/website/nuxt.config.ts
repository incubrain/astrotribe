import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import { defineNuxtConfig } from 'nuxt/config'

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
  extends: ['../../layers/base'],
  ssr: true,
  modules: ['@nuxt/content', '@nuxtjs/seo'],

  experimental: {
    inlineRouteRules: true,
    asyncContext: true,
  },

  devServer: {
    host: 'localhost',
    port: 3000,
  },

  site: {
    url: og.url,
    name: 'AstronEra',
    description: 'Astronomy Hub',
    defaultLocale: 'en',
  },

  vue: {
    compilerOptions: {
      isCustomElement: (tag) =>
        ['swiper-container', 'swiper-slide', 'swiper-wrapper'].includes(tag),
    },
  },
  css: ['swiper/element/css/autoplay', 'swiper/element/css/grid'],

  seo: {
    redirectToCanonicalSiteUrl: true,
  },

  ogImage: {
    componentOptions: {
      global: true,
    },
  },

  content: {
    highlight: {
      theme: {
        // !todo: light theme not working ??
        default: 'github-light',
        light: 'github-light',
        dark: 'github-dark',
      },
    },
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
          type: 'text/partytown',
        },
      ],
    },
  },

  imports: {
    autoImport: true,
  },

  nitro: {
    devProxy: {
      '/api': {
        target: `http://localhost:3000/api`,
      },
    },
  },

  // vite: {
  //   plugins: [nxViteTsPaths()]
  // },

  compatibilityDate: '2024-09-22',
})
