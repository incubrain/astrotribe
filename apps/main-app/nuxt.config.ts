import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  workspaceDir: '../../',
  srcDir: '.',
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
