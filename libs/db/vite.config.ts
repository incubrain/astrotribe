import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@astronera/db',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['@prisma/client'],
      output: [
        {
          format: 'es',
          dir: 'dist/esm',
          preserveModules: true,
          exports: 'named',
          entryFileNames: '[name].js',
        },
        {
          format: 'cjs',
          dir: 'dist/cjs',
          preserveModules: true,
          exports: 'named',
          entryFileNames: '[name].js',
        },
      ],
    },
    outDir: 'dist',
    emptyOutDir: false,
  },
  plugins: [
    dts({
      include: ['src/**/*.ts'],
      exclude: ['**/*.test.ts', 'src/**/*.spec.ts', 'src/generated/**/*'],
      rollupTypes: false,
      outDir: 'dist/types',
    }),
    {
      name: 'create-and-copy-package',
      buildStart() {
        // Create directories if they don't exist
        ;['dist/esm', 'dist/cjs', 'dist/types'].forEach((dir) => {
          if (!existsSync(resolve(__dirname, dir))) {
            mkdirSync(resolve(__dirname, dir), { recursive: true })
          }
        })
      },
      closeBundle() {
        const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'))

        const basePackage = {
          name: pkg.name,
          version: pkg.version,
          private: pkg.private,
          dependencies: pkg.dependencies,
        }

        // Write main package.json
        writeFileSync(
          resolve(__dirname, 'dist/package.json'),
          JSON.stringify(
            {
              ...basePackage,
              exports: {
                '.': {
                  types: './types/index.d.ts',
                  import: './esm/index.js',
                  require: './cjs/index.js',
                  default: './esm/index.js',
                },
              },
              main: './cjs/index.js',
              module: './esm/index.js',
              types: './types/index.d.ts',
            },
            null,
            2,
          ),
        )

        // Write ESM package.json
        writeFileSync(
          resolve(__dirname, 'dist/esm/package.json'),
          JSON.stringify({ type: 'module' }, null, 2),
        )

        // Write CJS package.json
        writeFileSync(
          resolve(__dirname, 'dist/cjs/package.json'),
          JSON.stringify({ type: 'commonjs' }, null, 2),
        )
      },
    },
  ],
})
