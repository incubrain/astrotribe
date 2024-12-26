import { FeatureConfigBuilder } from '../feature-builder'

const LOGGER_PATTERNS = [
  // Logger
  'libs/logger/**',
  '**/logger/**',
]

export const loggerConfig = new FeatureConfigBuilder()
  .setId('logger')
  .setName('Custom Logger')
  .description('Centralized Custom Logger')
  .patterns(LOGGER_PATTERNS)
  .withCommonConfigs('api', 'types', 'stateManagement')
  .ignore(['**/news.test.*', '**/news.spec.*', '**/news.stories.*'])
  .relatedTo()
  .setOutput({
    directory: 'ai-context',
    filename: 'newsfeed',
    extension: 'txt',
  })
  .build()
