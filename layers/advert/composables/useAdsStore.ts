// stores/ads.ts
import { defineStore } from 'pinia'
import type { AdPackage, Ad } from '~/types/referrals'

export const useAdsStore = defineStore('ads', () => {
  const MIN_POST_GAP = 7
  const MAX_POST_GAP = 18

  // State
  const isLoading = ref(true)
  const totalProcessedItems = ref(0)
  const lastAdPosition = ref(0)
  const nextAdPosition = ref(0)
  const adPackages = ref<AdPackage[]>([])
  const activeAds = ref<Ad[]>([])

  // Helper function to shuffle array
  function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  // Get next ad from the queue, reshuffling if necessary
  const currentAdQueue = ref<Ad[]>([])
  function getNextAd(): Ad {
    if (currentAdQueue.value.length === 0) {
      // We've used all ads, create a new shuffled queue
      currentAdQueue.value = shuffleArray(feedAds.value)
      console.log('Reshuffled ad queue:', currentAdQueue.value)
    }

    return currentAdQueue.value.shift()!
  }

  const popupAds = computed(() =>
    activeAds.value.filter((ad) => {
      const pkg = adPackages.value.find((p) => p.id === ad.package_id)
      console.log('popupAds:', ad)
      return pkg?.position === 'popup'
    }),
  )

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
    } catch (error: any) {
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
    } catch (error: any) {
      console.error('Error tracking ad interaction:', error)
    }
  }

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

    // Initialize ad queue if empty
    if (currentAdQueue.value.length === 0 && totalProcessedItems.value === 0) {
      currentAdQueue.value = shuffleArray(availableFeedAds)
      console.log('Initial ad queue:', currentAdQueue.value)
    }

    if (totalProcessedItems.value === 0) {
      const firstAd = currentAdQueue.value[0]
      const firstAdPackage = adPackages.value.find((pkg) => pkg.id === firstAd.package_id)!
      nextAdPosition.value = getNextAdPosition(0, firstAdPackage)
    }

    const adPositions: Array<{ position: number; ad: Ad }> = []

    // Calculate positions for new ads
    while (nextAdPosition.value < result.length + totalProcessedItems.value) {
      const nextAd = getNextAd()
      const adPackage = adPackages.value.find((pkg) => pkg.id === nextAd.package_id)!
      const adjustedPosition = nextAdPosition.value - totalProcessedItems.value

      if (adjustedPosition < result.length) {
        adPositions.push({
          position: adjustedPosition,
          ad: nextAd,
        })
      }

      nextAdPosition.value = getNextAdPosition(nextAdPosition.value, adPackage)
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
      })
    }

    if (!isNewContent) {
      totalProcessedItems.value += result.length
    }

    console.log('Integrated ads into feed:', {
      resultLength: result.length,
      remainingAdsInQueue: currentAdQueue.value.length,
      adPositions,
    })

    return result
  }

  function resetAdTracking() {
    lastAdPosition.value = 0
    nextAdPosition.value = 0
    totalProcessedItems.value = 0
    currentAdQueue.value = [] // This will trigger a reshuffle on next use
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
    popupAds,
    currentAdQueue,

    // Actions
    initialize,
    integrateAdsIntoFeed,
    trackInteraction,
    resetAdTracking,
  }
})
