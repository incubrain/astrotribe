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
      ...IGNORE_TYPES,
    ] as const,
  },
}

type CommonConfigKey =
  | 'base'
  | 'auth'
  | 'bookmarks'
  | 'content'
  | 'users'
  | 'monitoring'
  | 'feeds'
  | 'advertising'
  | 'social'
  | 'payments'
  | 'search'

export const COMMON_CONFIGS: Record<CommonConfigKey, CommonConfig> = {
  // Base infrastructure
  base: {
    description: 'Core infrastructure, utilities and shared code',
    include: [
      'libs/**/*',
      'layers/base/**/*',
      'layers/crud/**/*',
      '**/utils/**',
      '**/helpers/**',
      '**/core/**',
    ],
  },

  // Authentication & Authorization
  auth: {
    description: 'Authentication and authorization related code',
    include: [
      '**/auth/**',
      '**/auth.*',
      '**/login.*',
      '**/register.*',
      '**/permission*',
      '**/role*',
      '**/security*',
      '**/middleware/auth*',
    ],
  },

  // Bookmarks
  bookmarks: {
    description: 'Bookmark management functionality',
    include: [
      '**/bookmark*/**',
      '**/folder*/**',
      '**/components/**/bookmark*',
      '**/composables/**/bookmark*',
    ],
  },

  // Content Management
  content: {
    description: 'Content management and CMS functionality',
    include: ['**/content*/**', '**/article*/**', '**/news*/**', '**/blog*/**', '**/research*/**'],
  },

  // User Management
  users: {
    description: 'User management and profiles',
    include: ['**/user*/**', '**/profile*/**', '**/settings/**', '**/account*/**'],
  },

  // Analytics & Monitoring
  monitoring: {
    description: 'Analytics, monitoring, and metrics',
    include: [
      '**/monitoring*/**',
      '**/analytics*/**',
      '**/metrics*/**',
      '**/tracking*/**',
      '**/logger*/**',
    ],
  },

  // Feed Management
  feeds: {
    description: 'Feed and content stream functionality',
    include: ['**/feed*/**', '**/stream*/**', '**/components/**/feed*', '**/composables/**/feed*'],
  },

  // Advertising
  advertising: {
    description: 'Advertising and promotion features',
    include: ['**/advert*/**', '**/promotion*/**', '**/sponsor*/**', 'layers/advert/**'],
  },

  // Social Features
  social: {
    description: 'Social interactions and networking features',
    include: ['**/social*/**', '**/comment*/**', '**/follow*/**', '**/share*/**', '**/vote*/**'],
  },

  // Payments & Subscriptions
  payments: {
    description: 'Payment processing and subscription management',
    include: ['**/payment*/**', '**/subscription*/**', '**/billing*/**', '**/plan*/**'],
  },

  // Search
  search: {
    description: 'Search functionality',
    include: [
      '**/search/**',
      '**/filter*/**',
      '**/components/**/search*',
      '**/composables/**/search*',
    ],
  },
} as const
