import { fileURLToPath } from 'url'
import path, { resolve } from 'path'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function updatePackageJson() {
  return {
    name: 'update-package-json',
    closeBundle: () => {
      const pkgPath = path.resolve(__dirname, 'package.json')
      const distDir = path.resolve(__dirname, 'dist')
      const distPkgPath = path.resolve(distDir, 'package.json')

      // Ensure the dist directory exists
      if (!existsSync(distDir)) {
        mkdirSync(distDir, { recursive: true })
      }

      // Update the package.json file
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))

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

      writeFileSync(distPkgPath, JSON.stringify(pkg, null, 2))
    },
  }
}

export default defineConfig({
  resolve: {
    preserveSymlinks: true,
    conditions: ['node'],
    mainFields: ['module', 'main'],
  },
  build: {
    lib: {
      name: '@ib/logger',
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
      formats: ['es', 'cjs'],
    },
    outDir: resolve(__dirname, 'dist'),
    sourcemap: true,
    rollupOptions: {
      external: [
        'winston',
        'winston-transport',
        'winston-loki',
        'h3',
        '@ib/cache',
        '@astronera/db',
        'ioredis',
        'ms',
        '@astronera/db',
        '@napi-rs/snappy-linux-x64-gnu',
        '@napi-rs/snappy-linux-x64-musl',
        'http',
        'https',
        'url',
        'fs',
        'path',
      ],
      output: {
        exports: 'named',
        preserveModules: false,
        dir: resolve(__dirname, 'dist'),
      },
    },
  },
  plugins: [
    dts({
      include: ['src/**/*.ts'],
      exclude: ['**/*.test.ts', 'src/**/*.spec.ts'],
      rollupTypes: true,
      compilerOptions: {
        rootDir: resolve(__dirname, 'src'),
        outDir: resolve(__dirname, 'dist'),
        baseUrl: __dirname,
      },
    }),
    updatePackageJson(),
  ],
  optimizeDeps: {
    exclude: ['@astronera/db'],
  },
})
