import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineNuxtConfig({
  workspaceDir: '../../',
  extends: ['../../layers/base'],
  devServer: {
    host: 'localhost',
    port: 3009,
  },
  
  vite: {
    plugins: [nxViteTsPaths()]
  },

  imports: {
    autoImport: true,
  },


  routeRules: {
    '/': { redirect: '/register' },
  },
})
