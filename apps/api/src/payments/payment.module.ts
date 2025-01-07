// templates/module/content.module.ejs
import { Module } from '@nestjs/common'
import { CoreModule } from '@core/core.module'
import { PrismaModule } from '@core/modules/prisma.module'
import { PermissionModule } from '@core/modules/permission.module'
import { createDomainModule } from '@core/config/domain-config'
// Controllers
import { PaymentController } from '@payments/controllers/payment.controller'
import { PlanController } from '@payments/controllers/plan.controller'
import { ProviderController } from '@payments/controllers/provider.controller'
import { RefundController } from '@payments/controllers/refund.controller'
import { SubscriptionController } from '@payments/controllers/subscription.controller'

// Services
import { PaymentService } from '@payments/services/payment.service'
import { PlanService } from '@payments/services/plan.service'
import { ProviderService } from '@payments/services/provider.service'
import { RefundService } from '@payments/services/refund.service'
import { SubscriptionService } from '@payments/services/subscription.service'

@Module({
  imports: [
    PrismaModule,
    PermissionModule,
    CoreModule,
    createDomainModule('content', {
      requiresAuth: true,
      requiresCompany: false,
    }),
  ],
  controllers: [
    PaymentController,
    PlanController,
    ProviderController,
    RefundController,
    SubscriptionController
  ],
  providers: [
    PaymentService,
    PlanService,
    ProviderService,
    RefundService,
    SubscriptionService
  ],
  exports: [
    PaymentService,
    PlanService,
    ProviderService,
    RefundService,
    SubscriptionService
  ],
})
export class PaymentsModule {}
