// types/plans.ts
export enum PlanType {
  FREE = 'free',
  PRO = 'pro',
}

export interface PlanFeature {
  name: string
  limit: {
    [PlanType.FREE]: number
    [PlanType.PRO]: number
  }
  description: string
  comingSoon?: boolean
}

// composables/usePlan.ts
export const usePlan = () => {
  const FEATURES = {
    BOOKMARK_FOLDERS: {
      name: 'Bookmark Folders',
      limit: {
        free: 2,
        pro: -1, // unlimited
      },
      description: 'Organize your bookmarks into folders',
    },
    BOOKMARKS: {
      name: 'Bookmarks',
      limit: {
        free: 100,
        pro: -1,
      },
      description: 'Save articles for later',
    },
    CUSTOM_FOLDER_COLORS: {
      name: 'Custom Folder Colors',
      limit: {
        free: 0,
        pro: -1,
      },
      description: 'Personalize your folders with custom colors',
      comingSoon: true,
    },
  } as const

  // For now, we'll assume everyone is on free plan
  // Later this can be updated based on your auth/subscription system
  const userPlan = ref<PlanType>(PlanType.FREE)

  // Utility functions
  const getFeatureLimit = (featureKey: keyof typeof FEATURES) => {
    return FEATURES[featureKey].limit[userPlan.value]
  }

  const isFeatureAvailable = (featureKey: keyof typeof FEATURES) => {
    const feature = FEATURES[featureKey]
    return !feature.comingSoon && getFeatureLimit(featureKey) !== 0
  }

  const checkFeatureLimit = async (
    featureKey: keyof typeof FEATURES,
    currentCount: number,
  ): Promise<boolean> => {
    const limit = getFeatureLimit(featureKey)
    return limit === -1 || currentCount < limit
  }

  const getUpgradeMessage = (featureKey: keyof typeof FEATURES) => {
    const feature = FEATURES[featureKey]
    if (userPlan.value === PlanType.FREE) {
      return feature.limit.pro === -1
        ? `Upgrade to Pro for unlimited ${feature.name}`
        : `Upgrade to Pro for up to ${feature.limit.pro} ${feature.name}`
    }
    return ''
  }

  // This can be used to show remaining quota
  const getFeatureUsage = (featureKey: keyof typeof FEATURES, currentCount: number) => {
    const limit = getFeatureLimit(featureKey)
    return {
      used: currentCount,
      limit,
      remaining: limit === -1 ? -1 : limit - currentCount,
      isUnlimited: limit === -1,
    }
  }

  return {
    FEATURES,
    userPlan,
    getFeatureLimit,
    isFeatureAvailable,
    checkFeatureLimit,
    getUpgradeMessage,
    getFeatureUsage,
  }
}
