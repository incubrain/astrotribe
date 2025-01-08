import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import path from 'path'
import json from '@rollup/plugin-json'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    target: 'node22',
    outDir: 'dist/src',
    sourcemap: true,
    minify: false,
    modulePreload: false,
    ssr: true,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'src/index.ts'),
      },
      output: {
        dir: 'dist/src',
        format: 'esm',
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        interop: 'auto',
      },
      external: [
        // Node.js built-in modules
        'fs',
        'fs/promises',
        'path',
        'url',
        'crypto',
        'http',
        'https',
        'stream',
        'zlib',
        'buffer',
        'util',
        'os',
        'child_process',
        'node-fetch',
        // TensorFlow dependencies
        'long',
        'seedrandom',
        '@tensorflow/tfjs',
        '@tensorflow/tfjs-core',
        '@tensorflow/tfjs-layers',
        '@tensorflow/tfjs-converter',
        '@tensorflow/tfjs-data',
        '@tensorflow/tfjs-backend-webgl',
        '@tensorflow/tfjs-backend-cpu',
        '@tensorflow/tfjs-core/dist/public/chained_ops/register_all_chained_ops',
        '@tensorflow/tfjs-core/dist/register_all_gradients',
        // External dependencies
        /^node:/,
        '@tensorflow/tfjs',
        '@tensorflow/tfjs-backend-cpu',
        'sharp',
        'playwright',
        'playwright-core',
        '@playwright/test',
        /^playwright-.*/,
        /^@playwright\/.*/,
        'pg-boss',
        '@prisma/client',
        '@supabase/supabase-js',
        '@supabase/auth-js',
        '@supabase/functions-js',
        '@supabase/realtime-js',
        '@supabase/storage-js',
        '@supabase/postgrest-js',
        'robots-parser',
        'rss-parser',
        'p-limit',
      ],
    },
  },
  plugins: [
    json({
      preferConst: true,
      compact: true,
      namedExports: true,
      include: ['node_modules/**/*.json', '**/*.json'],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@types': path.resolve(__dirname, './src/types'),
      '@helpers': path.resolve(__dirname, './src/helpers'),
      '@core': path.resolve(__dirname, './src/core'),
      '@jobs': path.resolve(__dirname, './src/jobs/config'),
    },
    mainFields: ['module', 'jsnext:main', 'jsnext', 'main'],
    preserveSymlinks: true,
  },
  optimizeDeps: {
    exclude: [
      'long',
      'seedrandom',
      '@tensorflow/tfjs',
      '@tensorflow/tfjs-core',
      '@tensorflow/tfjs-layers',
      '@tensorflow/tfjs-converter',
      '@tensorflow/tfjs-data',
      '@tensorflow/tfjs-backend-webgl',
      '@tensorflow/tfjs-backend-cpu',
      '@supabase/supabase-js',
      '@supabase/auth-js',
      '@supabase/functions-js',
      '@supabase/realtime-js',
      '@supabase/storage-js',
      '@supabase/postgrest-js',
    ],
  },
})
