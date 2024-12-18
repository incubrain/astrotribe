// stores/referralStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PostgrestResponse } from '@supabase/supabase-js'

interface ReferralMetrics {
  totalReferrals: number
  conversions: number
  conversionRate: number
  totalValue: number
  avgConversionTime: number
  activeReferrers: number
  topPerformers: Array<{
    referrerCode: string
    totalReferrals: number
    conversionRate: number
    totalValue: number
  }>
  deviceBreakdown: Record<string, number>
  countryBreakdown: Record<string, number>
  hourlyDistribution: Record<number, number>
}

interface TimeRange {
  start: Date
  end: Date
}

interface ReferralData {
  id: string
  referrer_code: string
  status: 'pending' | 'converted' | 'abandoned'
  created_at: string
  converted_at: string | null
  conversion_value: number | null
  device_type: string
  country_code: string
}

interface TopPerformer {
  referrerCode: string
  totalReferrals: number
  conversionRate: number
  totalValue: number
  avgConversionTime: number
}

export function calculateConversionRate(referralsData: ReferralData[]): number {
  if (referralsData.length === 0) return 0

  const convertedCount = referralsData.filter((r) => r.status === 'converted').length
  return Number(((convertedCount / referralsData.length) * 100).toFixed(2))
}

export function calculateTotalValue(referralsData: ReferralData[]): number {
  return referralsData.reduce((total, referral) => {
    return total + (referral.conversion_value || 0)
  }, 0)
}

export function calculateAvgConversionTime(referralsData: ReferralData[]): number {
  const convertedReferrals = referralsData.filter((r) => r.status === 'converted' && r.converted_at)

  if (convertedReferrals.length === 0) return 0

  const totalHours = convertedReferrals.reduce((total, referral) => {
    const createdDate = new Date(referral.created_at)
    const convertedDate = new Date(referral.converted_at!)
    const hoursDiff = (convertedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60)
    return total + hoursDiff
  }, 0)

  return Number((totalHours / convertedReferrals.length).toFixed(2))
}

export function calculateTopPerformers(statsData: any[]): TopPerformer[] {
  // Sort by total value and get top 10
  return statsData
    .map((stat) => ({
      referrerCode: stat.referrer_code,
      totalReferrals: stat.total_referrals,
      conversionRate: Number(((stat.conversions / stat.total_referrals) * 100).toFixed(2)),
      totalValue: stat.total_value || 0,
      avgConversionTime: Number(stat.avg_conversion_time_hours?.toFixed(2)) || 0,
    }))
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 10)
}

export function calculateDeviceBreakdown(referralsData: ReferralData[]): Record<string, number> {
  if (!referralsData?.length) return {}

  // Count the occurrences
  const deviceCounts = referralsData.reduce(
    (acc, referral) => {
      const device = referral.device_type || 'unknown'
      acc[device] = (acc[device] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Log the raw counts to debug
  console.log('Device counts:', deviceCounts)

  const total = Object.values(deviceCounts).reduce((sum, count) => sum + count, 0)

  // Convert to percentages
  const breakdown = Object.entries(deviceCounts).reduce(
    (acc, [device, count]) => {
      acc[device] = Number(((count / total) * 100).toFixed(1))
      return acc
    },
    {} as Record<string, number>,
  )

  // Log the final breakdown to debug
  console.log('Device breakdown:', breakdown)

  return breakdown
}

export function calculateCountryBreakdown(referralsData: ReferralData[]): Record<string, number> {
  if (!referralsData?.length) return {}

  // Count the occurrences
  const countryCounts = referralsData.reduce(
    (acc, referral) => {
      const country = referral.country_code || 'unknown'
      acc[country] = (acc[country] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Log the raw counts to debug
  console.log('Country counts:', countryCounts)

  const total = Object.values(countryCounts).reduce((sum, count) => sum + count, 0)

  // Convert to percentages
  const breakdown = Object.entries(countryCounts).reduce(
    (acc, [country, count]) => {
      acc[country] = Number(((count / total) * 100).toFixed(1))
      return acc
    },
    {} as Record<string, number>,
  )

  // Log the final breakdown to debug
  console.log('Country breakdown:', breakdown)

  return breakdown
}

export function calculateHourlyDistribution(referralsData: ReferralData[]): Record<number, number> {
  if (!referralsData?.length) return {}

  // Initialize hours object with 0 counts
  const hourlyCounts = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    count: 0,
  }))

  // Count referrals by hour
  referralsData.forEach((referral) => {
    const hour = new Date(referral.created_at).getHours()
    hourlyCounts[hour].count++
  })

  // Log the raw counts to debug
  console.log('Hourly counts:', hourlyCounts)

  const total = hourlyCounts.reduce((sum, { count }) => sum + count, 0)

  // Convert to percentages and create final object
  const distribution = hourlyCounts.reduce(
    (acc, { hour, count }) => {
      acc[hour] = Number(((count / total) * 100).toFixed(1))
      return acc
    },
    {} as Record<number, number>,
  )

  // Log the final distribution to debug
  console.log('Hourly distribution:', distribution)

  return distribution
}

// Helper function to group data by date for trend analysis
export function calculateDateTrends(
  referralsData: ReferralData[],
  days: number = 30,
): Array<{
  date: string
  total: number
  converted: number
  conversionRate: number
}> {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  // Create map of dates
  const dateMap = new Map()
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0]
    dateMap.set(dateStr, {
      date: dateStr,
      total: 0,
      converted: 0,
      conversionRate: 0,
    })
  }

  // Populate with actual data
  referralsData.forEach((referral) => {
    const dateStr = new Date(referral.created_at).toISOString().split('T')[0]
    if (dateMap.has(dateStr)) {
      const data = dateMap.get(dateStr)
      data.total++
      if (referral.status === 'converted') {
        data.converted++
      }
      data.conversionRate = Number(((data.converted / data.total) * 100).toFixed(2))
    }
  })

  return Array.from(dateMap.values())
}

function getDefaultDateRange(): [Date, Date] {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 7)
  return [start, end]
}

export const useReferralStore = defineStore('referrals', () => {
  const metrics = ref<ReferralMetrics | null>(null)
  const timeRange = ref<[Date, Date]>(getDefaultDateRange())
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const referralData = ref<ReferralData[]>([])

  const conversionTrend = computed(() => {
    if (!metrics.value) return []
    return calculateDateTrends(referralData.value || [])
  })

  async function fetchMetrics() {
    const supabase = useSupabaseClient()
    isLoading.value = true
    error.value = null

    try {
      // Get stats from materialized view first
      const { data: statsData, error: statsError } = await supabase
        .from('referral_stats')
        .select('*')

      if (statsError) throw statsError

      console.log('Stats Data:', statsData) // Log stats data

      // Check the date range we're using
      console.log('Time Range:', {
        start: timeRange.value[0].toISOString(),
        end: timeRange.value[1].toISOString(),
      })

      // Get all referrals within the time range
      const { data: referralsData, error: referralsError } = await supabase
        .from('referrals')
        .select(
          `
        id,
        referrer_code,
        status,
        created_at,
        converted_at,
        conversion_value,
        device_type,
        browser,
        country_code,
        region,
        is_suspicious
      `,
        )
        .gte('created_at', timeRange.value[0].toISOString())
        .lte('created_at', timeRange.value[1].toISOString())
        .order('created_at', { ascending: true })

      if (referralsError) throw referralsError

      // Log the raw data for debugging
      console.log('Referrals Data:', {
        total: referralsData?.length,
        sample: referralsData?.[0],
        deviceTypes: [...new Set(referralsData?.map((r) => r.device_type))],
        countries: [...new Set(referralsData?.map((r) => r.country_code))],
        hours: [...new Set(referralsData?.map((r) => new Date(r.created_at).getHours()))],
        statuses: [...new Set(referralsData?.map((r) => r.status))],
      })

      referralData.value = referralsData || []

      const processedMetrics = {
        totalReferrals: referralsData?.length || 0,
        conversions: referralsData?.filter((r) => r.status === 'converted').length || 0,
        conversionRate: calculateConversionRate(referralsData || []),
        totalValue: calculateTotalValue(referralsData || []),
        avgConversionTime: calculateAvgConversionTime(referralsData || []),
        activeReferrers: new Set(referralsData?.map((r) => r.referrer_code) || []).size,
        topPerformers: calculateTopPerformers(statsData || []),
        deviceBreakdown: calculateDeviceBreakdown(referralsData || []),
        countryBreakdown: calculateCountryBreakdown(referralsData || []),
        hourlyDistribution: calculateHourlyDistribution(referralsData || []),
      }

      metrics.value = processedMetrics
      console.log('Final Metrics:', processedMetrics)

      // Log processed metrics for debugging
      console.log('Processed metrics:', metrics.value)
    } catch (e) {
      console.error('Error fetching metrics:', e)
      error.value = e instanceof Error ? e.message : 'An error occurred'
    } finally {
      isLoading.value = false
    }
  }

  return {
    metrics,
    referralData,
    timeRange,
    isLoading,
    error,
    conversionTrend,
    fetchMetrics,
  }
})
