import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@ib/logger',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['@ib/cache', '@astronera/db', 'ioredis', 'winston', 'h3'],
      output: {
        preserveModules: true,
        exports: 'named',
        // Ensure proper file extensions
        entryFileNames: ({ format }) => `[name]${format === 'es' ? '.js' : '.cjs'}`,
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
  },
  plugins: [
    dts({
      include: ['src/**/*.ts'],
      exclude: ['**/*.test.ts', 'src/**/*.spec.ts'],
      rollupTypes: true,
    }),
  ],
})
