import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

const root = resolve(__dirname)
const srcDir = resolve(root, 'src')
const outDir = resolve(root, 'dist')

console.log('root', root, 'srcDir', srcDir, 'outDir', outDir)

export default defineConfig({
  root: root, // Explicitly set root
  base: '', // Empty base for library
  build: {
    lib: {
      entry: resolve(srcDir, 'index.ts'),
      name: '@astronera/db',
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['@prisma/client'],
      output: {
        dir: outDir,
        sourcemap: true,
        preserveModules: true,
      },
    },
    outDir: outDir,
    emptyOutDir: true,
  },
  plugins: [
    dts({
      rollupTypes: true,
      tsconfigPath: resolve(root, 'tsconfig.json'),
      compilerOptions: {
        baseUrl: root,
        outDir: outDir,
        emitDeclarationOnly: true,
        declaration: true,
        declarationMap: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': srcDir,
    },
  },
})
