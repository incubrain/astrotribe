// cli/configs/features/payments.ts

import { FeatureConfigBuilder } from '../feature-builder'

const PAYMENT_PATTERNS = [
  // Payment components and UI
  'apps/**/components/**/Payment*.vue',
  'apps/**/components/payment/**',

  // Payment APIs and server routes
  'apps/**/server/api/payment/**',
  'apps/**/server/api/**/payment*.ts',
  'apps/**/server/api/**/subscription*.ts',

  // Payment stores and composables
  'apps/**/composables/usePayments.ts',
  'apps/**/composables/usePlan.ts',
  'apps/**/composables/**/payment*.ts',

  // Payment types and interfaces
  'apps/**/types/**/payment*.ts',
  'apps/**/types/**/subscription*.ts',

  // Payment database migrations and schemas
  'supabase/migrations/**/*payment*.sql',
  'supabase/migrations/**/*subscription*.sql',
]

export const paymentsConfig = new FeatureConfigBuilder()
  .setId('payments')
  .setName('Payments')
  .description('Payment processing and subscription management')
  .patterns(PAYMENT_PATTERNS)
  .withCommonConfigs('api', 'types')
  .ignore(['**/payment.test.*', '**/payment.spec.*', '**/payment.stories.*'])
  .relatedTo(['subscriptions', 'user-management', 'feature-access'])
  .setOutput({
    directory: 'ai-context',
    filename: 'payments',
    extension: 'txt',
  })
  .build()
