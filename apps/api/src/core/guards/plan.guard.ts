// guards/plan.guard.ejs
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PLAN_KEY } from "../decorators/plan.decorator";
import { PrismaService } from "../services/prisma.service";

@Injectable()
export class PlanGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPlans = this.reflector.getAllAndOverride<string[]>(PLAN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPlans) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;

    const userSubscription = await this.prisma.customer_subscriptions.findFirst(
      {
        where: {
          user_id: user.id,
          status: "ACTIVE",
        },
        include: {
          customer_subscription_plans: {
            select: {
              name: true,
            },
          },
        },
      }
    );

    // return requiredPlans.includes(userSubscription?.subscription_plan?.name);
  }
}
