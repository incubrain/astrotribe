// cli/configs/features/auth.ts
import { FeatureConfigBuilder } from '../feature-builder'
import { FEATURE_SETTINGS } from './conf'

const AUTH_PATTERNS = ['apps/auth/**']

export const authConfig = new FeatureConfigBuilder()
  .setId('auth')
  .setName('Authentication')
  .description('Authentication and authorization features')
  .patterns(AUTH_PATTERNS)
  .withCommonConfigs(['api', 'types', 'stateManagement', 'nuxtApp'])
  .ignore(['**/auth.test.*', '**/auth.spec.*', '**/auth.stories.*'])
  .relatedTo(['permissions'])
  .setOutput({
    directory: FEATURE_SETTINGS.output.directory,
    filename: 'auth',
    extension: FEATURE_SETTINGS.output.extension,
  })
  .build()
