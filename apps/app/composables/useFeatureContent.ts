import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useViewModeStore } from '~/stores/useViewModeStore'
import { useFeatureLimit } from '~/composables/useFeatureLimit'

type ContentType = 'news' | 'opportunities' | 'companies'

interface Options<T> {
  feature: string
  contentType: ContentType
  items: Ref<T[]>
}

export function useFeatureContent<T>(options: Options<T>) {
  console.log('useFeatureContent', options)
  const viewModeStore = useViewModeStore()
  const { viewMode } = storeToRefs(viewModeStore)

  // Auto-detect itemsPerRow based on viewMode
  const itemsPerRow = computed(() => {
    return viewMode.value === 'grid' ? 4 : 1
  })

  const {
    limit,
    isPro,
    isLimited,
    limitItems,
    shouldShowPaywall,
    remainingItems,
    progressPercentage,
    lastRowItems,
    totalCount,
  } = useFeatureLimit(options.feature, {
    itemsPerRow: itemsPerRow,
    items: options.items,
    contentType: options.contentType,
    viewMode: viewMode,
  })

  const limitedItems = computed(() => limitItems.value)

  const showPaywall = computed(() => shouldShowPaywall.value)

  return {
    // Raw values
    limitedItems,
    lastRowItems,
    showPaywall,
    totalCount,
    remainingItems,
    progressPercentage,
    viewMode,

    // Helpers
    isPro,
    isLimited,
    limit,
  }
}
