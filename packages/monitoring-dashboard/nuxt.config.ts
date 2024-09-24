import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';


export default defineNuxtConfig({
  workspaceDir: '../../',
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