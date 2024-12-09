// stores/ads.ts
import { defineStore } from 'pinia'
import type { AdPackage, Ad } from '~/types/ads'

export const useAdsStore = defineStore('ads', () => {
  // State
  const isLoading = ref(true)
  const totalProcessedItems = ref(0)
  const lastAdPosition = ref(0)
  const nextAdPosition = ref(0)
  const adPackages = ref<AdPackage[]>([])
  const activeAds = ref<Ad[]>([])

  // Getters
  const feedAds = computed(() => {
    return activeAds.value.filter((ad) => {
      console.log('feedAds:', ad)
      const pkg = adPackages.value.find((p) => p.id === ad.package_id)
      return pkg?.position === 'feed'
    })
  })

  const topBannerAd = computed(() => {
    return activeAds.value.find((ad) => {
      const pkg = adPackages.value.find((p) => p.id === ad.package_id)
      return pkg?.position === 'top'
    })
  })

  // Actions
  async function loadAdPackages() {
    const response = await $fetch('/api/ads/packages')
    console.log('Ad packages client:', response.data)
    adPackages.value = response.data || []
  }

  async function loadActiveAds() {
    isLoading.value = true
    try {
      const response = await $fetch('/api/ads/active')
      console.log('Active ads:', response.data)
      if (response.data) {
        activeAds.value = response.data
      }
    } catch (error) {
      console.error('Error loading active ads:', error)
    } finally {
      isLoading.value = false
    }
  }

  async function trackInteraction(
    variantId: string,
    type: 'view' | 'click',
    engagementTime?: number,
  ) {
    try {
      await $fetch('/api/ads/track', {
        method: 'POST',
        body: { variantId, type, engagementTime },
      })
    } catch (error) {
      console.error('Error tracking ad interaction:', error)
    }
  }

  function resetAdTracking() {
    lastAdPosition.value = 0
    nextAdPosition.value = 0
    totalProcessedItems.value = 0
  }

  const MIN_POST_GAP = 7
  const MAX_POST_GAP = 18

  function getNextAdPosition(currentPosition: number, adPackage: AdPackage) {
    const gap = Math.floor(Math.random() * (MAX_POST_GAP - MIN_POST_GAP + 1) + MIN_POST_GAP)
    return currentPosition + gap
  }

  function integrateAdsIntoFeed(newsItems: any[], isNewContent = false) {
    const result = [...newsItems]
    const availableFeedAds = feedAds.value

    if (availableFeedAds.length === 0) return result

    if (isNewContent) {
      resetAdTracking()
    }

    if (totalProcessedItems.value === 0) {
      const firstAdPackage = adPackages.value.find(
        (pkg) => pkg.id === availableFeedAds[0].package_id,
      )!
      console.log('First ad package:', firstAdPackage)
      nextAdPosition.value = getNextAdPosition(0, firstAdPackage)
    }

    let currentAdIndex = 0
    const adPositions: Array<{ position: number; ad: Ad }> = []

    // Calculate positions for new ads
    while (nextAdPosition.value < result.length + totalProcessedItems.value) {
      const currentAd = availableFeedAds[currentAdIndex]
      const adPackage = adPackages.value.find((pkg) => pkg.id === currentAd.package_id)!
      const adjustedPosition = nextAdPosition.value - totalProcessedItems.value

      if (adjustedPosition < result.length) {
        adPositions.push({
          position: adjustedPosition,
          ad: currentAd,
        })
      }

      nextAdPosition.value = getNextAdPosition(nextAdPosition.value, adPackage)
      currentAdIndex = (currentAdIndex + 1) % availableFeedAds.length
    }

    // Insert ads from back to front
    for (let i = adPositions.length - 1; i >= 0; i--) {
      const { position, ad } = adPositions[i]
      const globalPosition = position + totalProcessedItems.value

      result.splice(position, 0, {
        id: `ad-${ad.id}-${globalPosition}`,
        type: 'sponsored',
        content: {
          id: ad.id,
          package_id: ad.package_id,
          company_id: ad.company_id,
          company: ad.company,
          variants: ad.variants,
          start_date: ad.start_date,
          end_date: ad.end_date,
          active: ad.active,
        },
        sortIndex: globalPosition,
        adIndex: currentAdIndex,
      })
    }

    if (!isNewContent) {
      totalProcessedItems.value += result.length
    }

    console.log('Integrated ads into feed:', result, availableFeedAds, adPositions)

    return result
  }

  // Initialize
  async function initialize() {
    await loadAdPackages()
    await loadActiveAds()
  }

  return {
    // State
    isLoading,
    adPackages,
    activeAds,

    // Getters
    topBannerAd,
    feedAds,

    // Actions
    initialize,
    integrateAdsIntoFeed,
    trackInteraction,
    resetAdTracking,
  }
})
