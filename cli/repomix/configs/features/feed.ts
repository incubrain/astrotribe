// cli/configs/features/newsfeed.ts

import { FeatureConfigBuilder } from '../feature-builder'

const NEWSFEED_PATTERNS = [
  // News components
  'apps/**/components/news/**',
  'apps/**/components/News*.vue',
  'apps/**/components/feed/**',

  // Content management and API
  'apps/**/server/api/news/**',
  'apps/**/server/api/feed/**',

  // News stores and composables
  'apps/**/composables/news.store.ts',
  'apps/**/composables/useFeed*.ts',
  'apps/**/composables/**/news*.ts',

  // News types and interfaces
  'apps/**/types/news.ts',
  'apps/**/types/feed.ts',
  'apps/**/types/articles.ts',

  // News database and schemas
  'supabase/migrations/**/*news*.sql',
  'supabase/migrations/**/*feed*.sql',
  'supabase/migrations/**/*content*.sql',

  // News services and utilities
  '**news**',
  '**feed**',
  '**content**',

  '**/news/**',
  '**/feed/**',
  '**/content/**',
]

export const contentFeedConfig = new FeatureConfigBuilder()
  .setId('newsfeed')
  .setName('News Feed')
  .description('News feed management and content delivery system')
  .patterns(NEWSFEED_PATTERNS)
  .withCommonConfigs('api', 'types', 'stateManagement')
  .ignore(['**/news.test.*', '**/news.spec.*', '**/news.stories.*'])
  .relatedTo(['content-management', 'personalization', 'feed-sources'])
  .setOutput({ directory: 'ai-context', filename: 'newsfeed', extension: 'txt' })
  .build()
