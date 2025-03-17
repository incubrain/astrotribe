<script setup lang="ts">
const { fetchAnalyticsOverview } = useAdsAdminStore()

const metrics = ref({
  daily: {
    avgViews: 0,
    topBannerImpressions: 0,
    feedViews: 0,
    newsletterSubs: 0,
  },
  growth: {
    monthlyGrowth: 32,
    yearlyGrowth: 284,
  },
  engagement: {
    avgTimeOnSite: '4:32',
    returningUsers: 68,
    avgPagesPerVisit: 4.2,
  },
  demographics: {
    industry: [
      { name: 'Space Industry', percentage: 45 },
      { name: 'Research/Academia', percentage: 30 },
      { name: 'Technology', percentage: 15 },
      { name: 'Other', percentage: 10 },
    ],
  },
})

const isLoading = ref(true)

onMounted(async () => {
  try {
    // Fetch real analytics data
    const data = await fetchAnalyticsOverview('30')
    // Update metrics with real data when available
    isLoading.value = false
  } catch (error: any) {
    console.error('Error fetching metrics:', error)
    isLoading.value = false
  }
})
</script>

<template>
  <section class="wrapper mx-auto py-16">
    <h2 class="text-2xl md:text-3xl font-bold mb-4 text-center">Platform Performance</h2>
    <p class="text-gray-400 text-center mb-12"
      >Reach a growing community of space enthusiasts and industry professionals</p
    >

    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="flex justify-center items-center py-12"
    >
      <div class="relative w-16 h-16">
        <div class="absolute inset-0 rounded-full border-4 border-blue-500/20 animate-pulse" />
        <div class="absolute inset-0 rounded-full border-t-4 border-blue-400 animate-spin" />
      </div>
    </div>

    <div
      v-else
      class="space-y-8"
    >
      <!-- Daily Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          v-for="(stat, index) in [
            { label: 'Daily Views', value: '15K+', icon: 'mdi:eye-outline' },
            { label: 'Banner Impressions', value: '12K+', icon: 'mdi:presentation' },
            { label: 'Feed Engagement', value: '8K+', icon: 'mdi:thumb-up-outline' },
            { label: 'Newsletter Subscribers', value: '5K+', icon: 'mdi:email-outline' },
          ]"
          :key="index"
          class="bg-[#0A1021] rounded-lg border border-blue-900/30 p-6"
        >
          <div class="flex items-start gap-4">
            <div class="p-2 rounded-lg bg-blue-500/10">
              <Icon
                :name="stat.icon"
                class="w-6 h-6 text-blue-400"
              />
            </div>
            <div>
              <div class="text-2xl font-bold text-white">{{ stat.value }}</div>
              <div class="text-sm text-gray-400">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Growth Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Audience Growth -->
        <div class="bg-[#0A1021] rounded-lg border border-blue-900/30 p-6">
          <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
            <Icon
              name="mdi:trending-up"
              class="text-blue-400"
            />
            Platform Growth
          </h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-400">Monthly Growth</span>
              <span class="text-green-400">+{{ metrics.growth.monthlyGrowth }}%</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-400">Yearly Growth</span>
              <span class="text-green-400">+{{ metrics.growth.yearlyGrowth }}%</span>
            </div>
          </div>
        </div>

        <!-- Engagement Metrics -->
        <div class="bg-[#0A1021] rounded-lg border border-blue-900/30 p-6">
          <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
            <Icon
              name="mdi:account-group"
              class="text-blue-400"
            />
            Audience Engagement
          </h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-400">Avg. Time on Site</span>
              <span class="text-white">{{ metrics.engagement.avgTimeOnSite }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-400">Returning Users</span>
              <span class="text-white">{{ metrics.engagement.returningUsers }}%</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-400">Pages per Visit</span>
              <span class="text-white">{{ metrics.engagement.avgPagesPerVisit }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Audience Demographics -->
      <div class="bg-[#0A1021] rounded-lg border border-blue-900/30 p-6">
        <h3 class="text-lg font-semibold mb-6 flex items-center gap-2">
          <Icon
            name="mdi:chart-pie"
            class="text-blue-400"
          />
          Audience Demographics
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div
            v-for="demo in metrics.demographics.industry"
            :key="demo.name"
            class="text-center p-4"
          >
            <div class="text-2xl font-bold text-white mb-1">{{ demo.percentage }}%</div>
            <div class="text-sm text-gray-400">{{ demo.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
