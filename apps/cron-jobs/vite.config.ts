import { defineConfig } from 'vite'
import path from 'path'
import json from '@rollup/plugin-json'

console.log('Building cron jobs...', __dirname)

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
        // External dependencies
        /^node:/,
        '@tensorflow/tfjs',
        '@tensorflow/tfjs-backend-cpu',
        'sharp',
        'playwright',
        'pg-boss',
        '@prisma/client',
        '@supabase/supabase-js',
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
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@types': path.resolve(__dirname, './src/types'),
      '@helpers': path.resolve(__dirname, './src/helpers'),
      '@core': path.resolve(__dirname, './src/core'),
      '@jobs': path.resolve(__dirname, './src/jobs/config'),
      'tlds': path.resolve(__dirname, 'node_modules/tlds/index.json'),
    },
  },
  optimizeDeps: {
    exclude: ['@tensorflow/tfjs', '@tensorflow/tfjs-backend-cpu'],
    include: ['tlds'],
  },
})
