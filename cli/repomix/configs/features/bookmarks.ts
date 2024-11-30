// cli/configs/features/bookmarks.ts
import { FeatureConfigBuilder } from '../feature-builder'
import { FEATURE_SETTINGS } from './conf'

const BOOKMARK_PATTERNS = [
  'apps/**/bookmarks/**',
  'apps/**/components/**/bookmark*',
  'apps/**/composables/use-bookmark*',
  'apps/**/stores/bookmark*',
  'libs/shared/bookmarks/**',
]

export const bookmarksConfig = new FeatureConfigBuilder()
  .setId('bookmarks')
  .setName('Bookmarks')
  .description('Bookmark management and related features')
  .patterns(BOOKMARK_PATTERNS)
  .withCommonConfigs('api', 'types', 'stateManagement')
  .ignore(['**/bookmark.test.*', '**/bookmark.spec.*', '**/bookmark.stories.*'])
  .relatedTo('collections', 'tagging')
  .setOutput({
    directory: 'ai-context',
    filename: 'bookmarks',
    extension: FEATURE_SETTINGS.output.extension,
  })
  .build()
