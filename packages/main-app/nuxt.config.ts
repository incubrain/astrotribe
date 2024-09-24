

export default defineNuxtConfig({
  extends: ['../../layers/base'],

  modules: ['nuxt-tiptap-editor'],

  experimental: {
    // https://nuxt.com/docs/guide/going-further/experimental-features
    // cookieStore: true,
    // viewTransition: true,
    // typedPages: true,
    // sharedPrerenderData: true,
    inlineRouteRules: true,
    asyncContext: true,
  },

  tiptap: {
    prefix: 'Tiptap',
  },

  routeRules: {
    '/**': { appMiddleware: 'auth' },
  },
  

  compatibilityDate: '2024-09-10',
})
