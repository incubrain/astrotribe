// stores/adsAdmin.ts
import { defineStore } from 'pinia'

// types/ads.ts
export interface AdMetrics {
  id: string
  package_name: string
  ad_position: string
  company_name: string
  logo_url: string
  title: string
  total_views: number
  total_clicks: number
  ctr: number
  ad_start_date: string
  ad_end_date: string
  days_tracked: number
}

export interface DailyMetrics {
  date: string
  views: number
  clicks: number
  ctr: number
}

export interface AdVariantMetrics {
  variant_id: string
  is_control: boolean
  content: {
    title: string
    description: string
    featured_image?: string
    cta_text: string
  }
  total_views: number
  total_clicks: number
  ctr: number
  daily_metrics: DailyMetrics[]
}

export const useAdsAdminStore = defineStore('adsAdmin', () => {
  // State
  const overview = ref<AdMetrics | null>(null)
  const trends = ref<Record<string, AdMetrics[]>>({})
  const variants = ref<Record<string, AdVariantMetrics[]>>({})
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  async function fetchAnalyticsOverview(period: string = '30') {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch('/api/ads/analytics/overview', {
        query: { period },
      })
      overview.value = response.data
      return response.data
    } catch (err) {
      error.value = 'Failed to fetch analytics overview'
      console.error('Analytics overview error:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchDailyTrends(adId: string, period: string = '300') {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch('/api/ads/analytics/daily-trends', {
        query: { adId, period },
      })
      console.log('Daily trends:', response.data)
      trends.value[adId] = response.data
      return response.data
    } catch (err) {
      error.value = 'Failed to fetch daily trends'
      console.error('Daily trends error:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchVariantMetrics(adId: string) {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch(`/api/ads/variants/${adId}/metrics`)
      console.log('Variant metrics:', response.data)
      variants.value[adId] = response.data
      return response.data
    } catch (err) {
      error.value = 'Failed to fetch variant metrics'
      console.error('Variant metrics error:', err)
    } finally {
      isLoading.value = false
    }
  }

  function clearCache() {
    overview.value = null
    trends.value = {}
    variants.value = {}
    error.value = null
  }

  return {
    // State
    overview,
    trends,
    variants,
    isLoading,
    error,

    // Actions
    fetchAnalyticsOverview,
    fetchDailyTrends,
    fetchVariantMetrics,
    clearCache,
  }
})
