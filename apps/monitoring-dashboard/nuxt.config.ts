import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  workspaceDir: '../../',
  srcDir: '.',
  extends: ['/layers/base'],
  
  vite: {
    plugins: [nxViteTsPaths()]
  },

  routeRules: {
    '/**': { appMiddleware: 'auth' },
  },

  imports: {
    autoImport: true,
  },


  runtimeConfig: {
    influxUrl: '',
    influxToken: '',
    influxOrg: '',
    influxBucket: '',
  }
})