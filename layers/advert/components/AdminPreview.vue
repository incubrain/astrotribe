<!-- components/AdsAdminDashboard.vue -->
<script setup lang="ts">
const supabase = useSupabaseClient()
const ads = ref<Ad[]>([])
const currentIndex = ref(0)
const isLoading = ref(true)
const previewType = ref<'card' | 'banner'>('card')
const bannerPosition = ref<'top' | 'bottom'>('top')

const currentAd = computed(() => ads.value[currentIndex.value])

const fetchAds = async () => {
  try {
    const { data: adsData, error: adsError } = await supabase
      .from('ads')
      .select(
        `
        *,
        company:company_id (*),
        package:package_id (*),
        variants:ad_variants (
          *,
          metrics:ad_daily_metrics (*)
        )
      `,
      )
      .eq('active', true)
      .gte('end_date', new Date().toISOString())

    if (adsError) throw adsError
    ads.value = adsData || []
  } catch (error: any) {
    console.error('Error fetching ads:', error)
  } finally {
    isLoading.value = false
  }
}

const handleNext = () => {
  currentIndex.value = (currentIndex.value + 1) % ads.value.length
}

const handlePrevious = () => {
  currentIndex.value = (currentIndex.value - 1 + ads.value.length) % ads.value.length
}

const calculateMetrics = (variant: any) => {
  const totalViews = variant.metrics?.reduce((sum: number, m: any) => sum + m.views, 0) || 0
  const totalClicks = variant.metrics?.reduce((sum: number, m: any) => sum + m.clicks, 0) || 0
  const ctr = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0

  return {
    totalViews,
    totalClicks,
    ctr: ctr.toFixed(2),
  }
}

onMounted(() => {
  fetchAds()
})
</script>

<template>
  <div class="w-full p-6">
    <div class="rounded-xl overflow-hidden">
      <div class="p-6">
        <!-- Header Controls -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-white">Advertisement Preview</h2>
          <div class="flex items-center gap-4">
            <!-- Preview Type Toggle -->
            <div class="flex rounded-lg bg-slate-800 overflow-hidden">
              <button
                class="px-4 py-2 text-sm transition-colors"
                :class="
                  previewType === 'card'
                    ? 'bg-blue-500 text-white'
                    : 'text-slate-400 hover:text-white'
                "
                @click="previewType = 'card'"
              >
                Card
              </button>
              <button
                class="px-4 py-2 text-sm transition-colors"
                :class="
                  previewType === 'banner'
                    ? 'bg-blue-500 text-white'
                    : 'text-slate-400 hover:text-white'
                "
                @click="previewType = 'banner'"
              >
                Banner
              </button>
            </div>

            <!-- Navigation -->
            <span class="text-sm text-slate-400">{{ currentIndex + 1 }} of {{ ads.length }}</span>
          </div>
        </div>

        <!-- Loading State -->
        <div
          v-if="isLoading"
          class="flex items-center justify-center h-96"
        >
          <PrimeProgressSpinner />
        </div>

        <template v-else-if="currentAd">
          <!-- Ad Info -->
          <div class="mb-6">
            <div class="grid grid-cols-4 gap-4 p-4 bg-slate-800/50 rounded-lg">
              <div>
                <p class="text-sm text-slate-400">Company</p>
                <p class="font-medium text-white">{{ currentAd.company.name }}</p>
              </div>
              <div>
                <p class="text-sm text-slate-400">Package</p>
                <p class="font-medium text-white">{{ currentAd.package.name }}</p>
              </div>
              <div>
                <p class="text-sm text-slate-400">Status</p>
                <p class="font-medium text-white">
                  {{ new Date() < new Date(currentAd.start_date) ? 'Scheduled' : 'Active' }}
                </p>
              </div>
              <div>
                <p class="text-sm text-slate-400">Date Range</p>
                <p class="font-medium text-white">
                  {{ new Date(currentAd.start_date).toLocaleDateString() }} -
                  {{ new Date(currentAd.end_date).toLocaleDateString() }}
                </p>
              </div>
            </div>
          </div>

          <!-- Preview Area -->
          <div
            :class="[
              previewType === 'card'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                : 'flex flex-col space-y-8',
            ]"
          >
            <div
              v-for="variant in currentAd.variants"
              :key="variant.id"
              class="space-y-4"
            >
              <!-- Variant Header -->
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <h4 class="font-medium text-white">
                    {{
                      variant.is_control ? 'Control Variant' : `Variant ${variant.id.slice(0, 8)}`
                    }}
                  </h4>
                  <span class="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400">
                    Active
                  </span>
                </div>
              </div>

              <!-- Metrics -->
              <div class="bg-slate-800/50 rounded-lg p-4">
                <div class="grid grid-cols-4 gap-4">
                  <div>
                    <p class="text-sm text-slate-400 mb-1">Total Views</p>
                    <p class="text-lg font-medium text-white">
                      {{ calculateMetrics(variant).totalViews.toLocaleString() }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-slate-400 mb-1">Total Clicks</p>
                    <p class="text-lg font-medium text-white">
                      {{ calculateMetrics(variant).totalClicks.toLocaleString() }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-slate-400 mb-1">CTR</p>
                    <p class="text-lg font-medium text-white">
                      {{ calculateMetrics(variant).ctr }}%
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-slate-400 mb-1">Performance</p>
                    <p class="text-lg font-medium text-green-400">
                      {{ variant.performance_metrics?.avgEngagementTime?.toFixed(1) || '0.0' }}s avg
                    </p>
                  </div>
                </div>
              </div>

              <!-- Preview Frame -->
              <div
                class="relative rounded-lg overflow-hidden"
                :class="{ 'w-full': previewType === 'banner' }"
              >
                <div class="absolute inset-0 bg-slate-800/50" />
                <!-- Card Preview -->
                <AdsFeedCard
                  v-if="previewType === 'card'"
                  :ad="{
                    ...currentAd,
                    variants: [variant],
                  }"
                />

                <!-- Banner Preview -->
                <div
                  v-else
                  class="w-full"
                >
                  <AdsBanner
                    :ad="{
                      ...currentAd,
                      variants: [variant],
                    }"
                    :position="bannerPosition"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>

        <div
          v-else
          class="text-center p-8"
        >
          <p class="text-lg text-slate-400">No active advertisements found</p>
        </div>
      </div>
    </div>
  </div>
</template>
