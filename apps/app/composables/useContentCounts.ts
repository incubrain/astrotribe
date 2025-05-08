import { ref, onMounted, computed } from 'vue'
import { GLOBAL_BENEFITS, FEATURES } from '#shared/constants'
import { formatNumber } from '~/utils/formatNumber'

export const useContentCounts = () => {
  const supabase = useSupabaseClient()

  // Weekly counts
  const weeklyNewsTotal = ref(0)
  const weeklyOpportunitiesTotal = ref(0)

  // Total counts
  const newsTotal = ref(0)
  const opportunitiesTotal = ref(0)
  const companiesTotal = ref(0)

  // Total items across all content types
  const fullTotal = computed(() => {
    return newsTotal.value + opportunitiesTotal.value + companiesTotal.value
  })

  const isLoading = ref(true)

  const getSevenDaysAgo = () => {
    const date = new Date()
    date.setDate(date.getDate() - 7)
    return date.toISOString()
  }

  const fetchAllCounts = async () => {
    isLoading.value = true

    try {
      // Fetch both weekly and total counts in parallel
      const [
        weeklyNewsResult,
        weeklyOpportunitiesResult,
        totalNewsResult,
        totalOpportunitiesResult,
        companiesResult,
      ] = await Promise.all([
        // Weekly news count
        supabase
          .from('contents')
          .select('id', { count: 'exact' })
          .eq('content_type', 'news')
          .gte('created_at', getSevenDaysAgo())
          .is('deleted_at', null),

        // Weekly jobs count
        supabase
          .from('opportunities')
          .select('id', { count: 'exact' })
          .gte('created_at', getSevenDaysAgo()),

        // Total news count
        supabase
          .from('contents')
          .select('id', { count: 'exact' })
          .eq('content_type', 'news')
          .is('deleted_at', null),

        // Total jobs count
        supabase.from('opportunities').select('id', { count: 'exact' }),

        // Companies count
        supabase.from('companies').select('id', { count: 'exact' }),
      ])

      // Update reactive state with counts
      weeklyNewsTotal.value = weeklyNewsResult.count || 0
      weeklyOpportunitiesTotal.value = weeklyOpportunitiesResult.count || 0
      newsTotal.value = totalNewsResult.count || 0
      opportunitiesTotal.value = totalOpportunitiesResult.count || 0
      companiesTotal.value = companiesResult.count || 0

      console.log('Content counts updated:', {
        weekly: {
          news: weeklyNewsTotal.value,
          jobs: weeklyOpportunitiesTotal.value,
        },
        total: {
          news: newsTotal.value,
          jobs: opportunitiesTotal.value,
          companies: companiesTotal.value,
          all: fullTotal.value,
        },
      })
    } catch (err) {
      console.error('Error fetching content counts:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Dynamic content-specific benefits
  const contentBenefits = computed(() => {
    return [
      {
        text: `Access ${formatNumber(companiesTotal.value)}+ space company profiles`,
        icon: 'mdi:office-building',
      },
      {
        text: `View ${formatNumber(newsTotal.value)}+ space news articles`,
        icon: 'mdi:newspaper-variant',
      },
      {
        text: `Get ${formatNumber(weeklyNewsTotal.value)}+ new articles weekly`,
        icon: 'mdi:rss',
      },
      {
        text: `Explore ${formatNumber(opportunitiesTotal.value)}+ space career listings`,
        icon: 'mdi:briefcase-search',
      },
      {
        text: `Receive ${formatNumber(weeklyOpportunitiesTotal.value)}+ new jobs weekly`,
        icon: 'mdi:briefcase-plus',
      },
    ]
  })

  // Combine content benefits with global benefits
  const benefits = computed(() => {
    // Return combined benefits array
    return [...contentBenefits.value, ...GLOBAL_BENEFITS]
  })

  const getPlanetType = (featureKey: string) => {
    switch (featureKey) {
      case 'DISCOVERY':
        return 'mars'
      case 'COMPANIES':
        return 'jupiter'
      case 'OPPORTUNITY_LISTINGS':
        return 'saturn'
      case 'EVENTS':
        return 'neptune'
      default:
        return 'earth'
    }
  }

  const getCountForType = (type: string) => {
    switch (type) {
      case 'news':
        return newsTotal.value
      case 'opportunities':
        return opportunitiesTotal.value
      case 'companies':
        return companiesTotal.value
      case 'weekly_news':
        return weeklyNewsTotal.value
      case 'weekly_opportunities':
        return weeklyOpportunitiesTotal.value
      default:
        return 0
    }
  }

  onMounted(fetchAllCounts)

  return {
    // Weekly counts
    weeklyNewsTotal,
    weeklyOpportunitiesTotal,

    // Total counts
    newsTotal,
    opportunitiesTotal,
    companiesTotal,
    fullTotal,

    isLoading,
    refresh: fetchAllCounts,
    benefits,
    contentBenefits, // In case we need only the dynamic content benefits
    getPlanetType,
    getCountForType,
  }
}
