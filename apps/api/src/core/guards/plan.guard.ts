// guards/plan.guard.ejs
import { CanActivate, ExecutionContext } from '@nestjs/common'
import { CustomLogger } from '@core/logger/custom.logger'
import { Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PLAN_KEY } from '../decorators/plan.decorator'
import { PrismaService } from '../services/prisma.service'

@Injectable()
export class PlanGuard implements CanActivate {
  logger = new CustomLogger('plan-guard')
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  // guards/plan.guard.ts
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPlans = this.reflector.getAllAndOverride<string[]>(PLAN_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredPlans) {
      this.logger.debug('No plan requirements for this route')
      return true
    }

    const { user } = context.switchToHttp().getRequest()
    if (!user) {
      this.logger.warn('No user found in request')
      return false
    }

    this.logger.debug('Checking user subscription', {
      userId: user.id,
      requiredPlans,
    })

    const userSubscription = await this.prisma.customer_subscriptions.findFirst({
      where: {
        user_id: user.id,
        status: 'ACTIVE',
      },
      include: {
        customer_subscription_plans: {
          select: {
            name: true,
          },
        },
      },
    })

    this.logger.debug('Found subscription status', {
      hasActiveSubscription: !!userSubscription,
      planName: userSubscription?.customer_subscription_plans?.name,
    })

    const hasRequiredPlan = requiredPlans.includes(
      userSubscription?.customer_subscription_plans?.name,
    )

    return hasRequiredPlan
  }
}
