import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@ib/cache',
      fileName: 'index',
      formats: ['es', 'cjs'], // This enables both ESM and CJS
    },
    rollupOptions: {
      external: ['ioredis', 'ms', '@astronera/db'],
      output: {
        // Ensure both formats maintain directory structure
        preserveModules: true,
        // Optional: Configure format-specific options
        exports: 'named',
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
  plugins: [
    dts({
      include: ['src/**/*.ts'],
      exclude: ['**/*.test.ts', 'src/**/*.spec.ts'],
      rollupTypes: true,
    }),
  ],
})
