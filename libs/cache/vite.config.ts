import { resolve } from 'path'
import { readFileSync, writeFileSync } from 'fs'
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
        exports: 'named',
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
    {
      name: 'copy-package',
      closeBundle() {
        // Read the original package.json
        const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'))

        // Modify the paths to be relative to dist
        pkg.main = './index.cjs'
        pkg.module = './index.js'
        pkg.types = './index.d.ts'
        pkg.exports = {
          '.': {
            types: './index.d.ts',
            import: './index.js',
            require: './index.cjs',
          },
        }

        // Remove unnecessary fields for the distributed package
        delete pkg.scripts
        delete pkg.devDependencies
        delete pkg.files

        // Write the modified package.json to dist
        writeFileSync(resolve(__dirname, 'dist/package.json'), JSON.stringify(pkg, null, 2))
      },
    },
  ],
})
