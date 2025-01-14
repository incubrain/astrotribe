// vite.config.ts
import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const root = resolve(__dirname)

export default defineConfig({
  build: {
    lib: {
      entry: resolve(root, 'src/index.ts'),
      name: '@ib/cache',
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['ioredis', 'ms', '@astronera/db'],
      output: {
        preserveModules: true,
        exports: 'named',
        dir: resolve(root, 'dist'),
      },
    },
    outDir: resolve(root, 'dist'),
    emptyOutDir: true,
  },
  plugins: [
    dts({
      include: ['src/**/*.ts'],
      exclude: ['**/*.test.ts', 'src/**/*.spec.ts'],
      rollupTypes: true,
      compilerOptions: {
        rootDir: resolve(root, 'src'),
        outDir: resolve(root, 'dist'),
        baseUrl: root,
      },
    }),
  ],
  resolve: {
    alias: {
      '@astronera/db': resolve(root, '../db/src'),
    },
  },
})
