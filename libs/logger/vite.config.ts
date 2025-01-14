import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@ib/logger',
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['@ib/cache', '@astronera/db', 'winston', 'h3', 'ioredis', /node_modules/],
      output: {
        preserveModules: true,
        exports: 'named',
        dir: 'dist',
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    dedupe: ['@ib/cache', '@astronera/db'],
  },
})
