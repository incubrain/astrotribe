// vite.config.ts for @astronera/db
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  build: {
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@astronera/db',
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['@prisma/client', './generated/client', './generated/client/index-browser'],
      output: {
        preserveModules: true,
        exports: 'named',
        dir: 'dist',
      },
    },
    outDir: 'dist',
    emptyOutDir: false,
  },
  resolve: {
    alias: {
      './generated/client': resolve(__dirname, 'src/generated/client'),
      '@prisma/client': '@prisma/client',
    },
  },
})
