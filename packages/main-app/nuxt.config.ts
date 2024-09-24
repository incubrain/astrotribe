import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineNuxtConfig({
  workspaceDir: '../../',
  extends: ['../../layers/base'],
  
  modules: ['nuxt-tiptap-editor'],
  
  experimental: {
    inlineRouteRules: true,
    asyncContext: true,
  },
  
  vite: {
    plugins: [nxViteTsPaths()]
  },

  tiptap: {
    prefix: 'Tiptap',
  },

  routeRules: {
    '/**': { appMiddleware: 'auth' },
  },

  ssr: false,

  nitro: {
    externals: {
      inline: ['sharp'],
    },
  },
  build: {
    transpile: ['sharp'],
  },

  imports: {
    autoImport: true,
  },

})
