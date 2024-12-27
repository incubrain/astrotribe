import { FEATURES } from '#shared/constants'

enum PlanType {
  FREE = 'free',
  PRO = 'pro',
}

export const validateFeatureLimit = async (
  event: H3Event,
  feature: string,
  currentCount: number,
) => {
  // For now, assume free plan
  const userPlan = PlanType.FREE

  const limit = FEATURES[feature].limit[userPlan]

  if (limit !== -1 && currentCount >= limit) {
    throw createError({
      statusCode: 403,
      message: `You have reached the ${FEATURES[feature].name.toLowerCase()} limit for your plan.`,
    })
  }
}
