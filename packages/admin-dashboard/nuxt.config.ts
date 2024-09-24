import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineNuxtConfig({
  workspaceDir: '../../',
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
