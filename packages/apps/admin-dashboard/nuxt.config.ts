import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  workspaceDir: '../../',
  srcDir: '.',
  extends: ['../../layers/base'],
  modules: ['@nuxt/content'],
  ssr: false,
  routeRules: {
    '/**': { appMiddleware: 'auth' },
  },

  vite: {
    plugins: [nxViteTsPaths()]
  },

  imports: {
    autoImport: true,
  },

})