import type { CommonConfig } from '../types'

const IGNORE_TESTING_FILES = ['**/*.test.*', '**/*.spec.*', '**/*.stories.*', 'vitest.*']

const IGNORE_CONFIG_FILES = [
  '**/*.setup.*',
  'prettier.config.*',
  'lighthouserc.*',
  'eslint.*',
  'babel.*',
  'jest.*',
  'postcss.*',
  'stylelint.*',
  'tsconfig.*',
  'vite.*',
  'webpack.*',
  'rollup.*',
  '.eslintrc.*',
  '.prettierrc.*',
  '.gitignore',
  '.npmignore',
  '.gitattributes',
  '.prettierignore',
  '**/.eslintcache',
]

const IGNORE_NUXT_FILES = ['**/.output/**', '**/.nuxt/**', '**/temp/**', '**/.playground/**']

const IGNORE_SUPABASE_FILES = ['**/seed.sql', '**/schema.gen.ts']
const IGNORE_NX_FILES = ['.nx']
const IGNORE_TYPES = ['**/*.d.ts', '**/types/**']

// cli/configs/base-config.ts
export const BASE_CONFIG = {
  ignore: {
    useGitignore: true,
    useDefaultPatterns: true,
    customPatterns: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/.git/**',
      '**/tmp/**',
      '**/.cache/**',
      '**/logs/**',
      '**/build/**',
      '**/*.test.*',
      '**/*.spec.*',
      '**/*.stories.*',
      '**/*.txt',
      '**/*.md',
      '**/*.yml',
      '**/*.css',
      '**/*.json',
      '**/*.svg',
      '**/*.spec.ts',
      'cli/**',
      'ci/**',
      'generators/**',
      'repomix/**',
      'scripts/**',
      '**/backups/**',
      '**/migrations/**',
      'ai-docs/**',
      ...IGNORE_CONFIG_FILES,
      ...IGNORE_TESTING_FILES,
      ...IGNORE_NUXT_FILES,
      ...IGNORE_SUPABASE_FILES,
      ...IGNORE_NX_FILES,
      ...IGNORE_TYPES,
    ] as const,
  },
}

export const COMMON_CONFIGS: Record<string, CommonConfig> = {
  nuxtApp: {
    description: 'Nuxt application configuration files',
    include: ['nuxt.config.ts', 'app.config.ts', 'tailwind.config.ts'],
  },
  stateManagement: {
    description: 'State management related files',
    include: ['apps/**/stores/**', 'apps/**/state/**'],
  },
  api: {
    description: 'API endpoints and route handlers',
    include: ['apps/**/server/api/**', 'apps/**/server/routes/**'],
  },
  types: {
    description: 'TypeScript type definitions',
    include: ['apps/**/types/**', 'libs/**/types/**'],
    ignore: {
      customPatterns: ['**/*.test.*', '**/*.spec.*'],
    },
  },
  composables: {
    description: 'Vue composables and hooks',
    include: ['apps/**/composables/**', 'libs/**/composables/**'],
  },
} as const
