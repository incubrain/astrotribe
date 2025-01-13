import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@astronera/db',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['@prisma/client'],
      output: {
        preserveModules: true,
        dir: 'dist/libs/db',
      },
    },
    outDir: 'dist/libs/db',
    emptyOutDir: true,
  },
  plugins: [
    dts({
      include: ['src/**/*.ts'],
      exclude: ['**/*.test.ts', 'src/**/*.spec.ts'],
      outDir: 'dist/libs/db',
      copyDtsFiles: true,
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
})
