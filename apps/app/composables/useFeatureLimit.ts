import { computed, unref, type Ref, type ComputedRef } from 'vue'
import { storeToRefs } from 'pinia'
import { type FeatureKey, FEATURES, PlanType } from '#shared/constants'
import { useContentCounts } from '~/composables/useContentCounts'
import { useViewModeStore } from '~/stores/useViewModeStore'

type ContentType = 'news' | 'jobs' | 'companies'

interface FeatureLimitOptions<T> {
  feature: FeatureKey
  contentType: ContentType
  items: Ref<T[]> | ComputedRef<T[]>
  itemsPerRow?: number
}

export const useFeatureLimit = <T>(options: FeatureLimitOptions<T>) => {
  console.log('useFeatureLimit', options)

  // User and store access
  const currentUser = useCurrentUser()
  const { profile } = storeToRefs(currentUser)
  const contentCounts = useContentCounts()

  // Get view mode from store
  const viewModeStore = useViewModeStore()
  const { viewMode } = storeToRefs(viewModeStore)

  // Auto-detect itemsPerRow based on viewMode if not provided
  const itemsPerRow = computed(() => {
    return options.itemsPerRow ?? (viewMode.value === 'grid' ? 4 : 1)
  })

  // Always unwrap items so it's computed + reactive
  const items = computed(() => options.items.value)

  // Determine user plan
  const userPlan = computed(() =>
    profile.value?.user_plan === 'free' ? PlanType.FREE : PlanType.PRO,
  )

  const featureConfig = computed(() => FEATURES[options.feature])
  console.log('Feature config:', featureConfig.value)

  if (!featureConfig.value) {
    console.error(`Feature "${options.feature}" not found in FEATURES`)
    return {
      limitedItems: items,
      lastRowItems: [],
      showPaywall: false,
      totalCount: 0,
      remainingItems: 0,
      progressPercentage: 0,
      viewMode,
      isPro: false,
      isLimited: false,
      limit: -1,
    }
  }
  const limit = computed(() => featureConfig.value.limit[userPlan.value])
  const isPro = computed(() => userPlan.value === PlanType.PRO)
  const isLimited = computed(() => !isPro.value && limit.value !== -1)

  // Limited items
  const limitItems = computed(() => {
    console.log('Calculating limitItems:', {
      isLimited: isLimited.value,
      itemsLength: items.value?.length,
      limit: limit.value,
    })

    if (!isLimited.value || !items.value?.length) return items.value
    return items.value.slice(0, limit.value)
  })

  // Whether to show paywall
  const shouldShowPaywall = computed(() => {
    const result = isLimited.value && items.value.length > limit.value
    console.log('shouldShowPaywall:', {
      isLimited: isLimited.value,
      itemsLength: items.value.length,
      limit: limit.value,
      result,
    })
    return result
  })

  // Calculate remaining items
  const remainingItems = computed(() => {
    return Math.max(0, items.value.length - limitItems.value.length)
  })

  // Get total count from content counts
  const totalCount = computed(() => {
    console.log('Calculating totalCount:', {
      contentType: options.contentType,
      itemsLength: items.value.length,
      limit: limit.value,
      isLimited: isLimited.value,
      isPro: isPro.value,
    })
    if (!options.contentType) return items.value.length
    return contentCounts.getCountForType(options.contentType)
  })

  // Calculate progress percentage
  const progressPercentage = computed(() => {
    if (totalCount.value === 0) return 0
    return Math.min(100, Math.round((limitItems.value.length / totalCount.value) * 100))
  })

  // Get items for the last row (to be blurred)
  const lastRowItems = computed(() => {
    if (!shouldShowPaywall.value) return []

    const endIndex = limit.value + itemsPerRow.value
    return items.value.slice(limit.value, endIndex)
  })

  return {
    // Raw values
    limitedItems: limitItems,
    lastRowItems,
    showPaywall: shouldShowPaywall,
    totalCount,
    remainingItems,
    progressPercentage,
    viewMode,

    // Helpers
    isPro,
    isLimited,
    limit,
    featureConfig,
  }
}
