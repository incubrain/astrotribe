<script setup lang="ts">
const { selectedPackage, getPackageMetrics } = useAdvertising()
const duration = ref(1)
const isLoading = ref(false)

const metrics = computed(() => {
  if (!selectedPackage.value) return null

  const baseMetrics = getPackageMetrics(selectedPackage.value.position)
  if (!baseMetrics) return null

  return {
    // Reach Metrics
    totalViews: baseMetrics.avgViews * duration.value,
    uniqueVisitors: Math.round(baseMetrics.avgViews * 0.75) * duration.value,
    viewFrequency: 2.4,

    // Engagement Metrics
    projectedClicks: Math.round(
      baseMetrics.avgViews * (baseMetrics.clickRate / 100) * duration.value,
    ),
    avgEngagement: baseMetrics.avgEngagement,
    clickRate: baseMetrics.clickRate,
    bounceRate: 28,

    // Audience Metrics
    industryReach: {
      spaceIndustry: 45,
      research: 30,
      technology: 15,
      other: 10,
    },
    geographicReach: {
      namerica: 40,
      europe: 35,
      asia: 20,
      other: 5,
    },

    // Investment Metrics
    totalInvestment: selectedPackage.value.price * duration.value,
    cpmRate:
      ((selectedPackage.value.price * duration.value) / (baseMetrics.avgViews * duration.value)) *
      1000,
    estimatedRoi: 280,
  }
})
</script>

<template>
  <section class="container mx-auto px-4 py-16">
    <h2 class="text-2xl md:text-3xl font-bold mb-4 text-center">Calculate Your Impact</h2>
    <p class="text-gray-400 text-center mb-12"
      >Project your reach based on historical platform data</p
    >

    <div
      v-if="!selectedPackage"
      class="text-center py-12"
    >
      <p class="text-gray-400 mb-4">Select a package above to see projected performance</p>
      <Icon
        name="mdi:arrow-up-circle"
        class="w-8 h-8 text-blue-400 animate-bounce"
      />
    </div>

    <div
      v-else
      class="bg-[#0A1021] rounded-lg border border-blue-900/30 p-8"
    >
      <!-- Package Info -->
      <div class="mb-8">
        <div class="text-sm text-blue-400 mb-2">Selected Package</div>
        <div class="text-3xl font-bold text-white mb-4">{{ selectedPackage.name }}</div>
        <p class="text-gray-400">{{ selectedPackage.description }}</p>
      </div>

      <!-- Duration Selector -->
      <div class="mb-12">
        <label class="block text-sm text-blue-400 mb-2">Campaign Duration (months)</label>
        <PrimeInputNumber
          v-model="duration"
          :min="1"
          :max="12"
          class="w-full bg-[#030711]"
          :pt="{
            input: {
              class: 'w-full bg-slate-900 border-blue-900/30 text-xl py-3',
            },
          }"
        />
      </div>

      <!-- Metrics Display -->
      <div
        v-if="metrics"
        class="space-y-12"
      >
        <!-- Reach Metrics -->
        <div>
          <h3 class="text-lg font-semibold text-blue-400 mb-4">Reach Metrics</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-slate-900/50 rounded-lg p-6 border border-blue-900/20">
              <div class="flex items-center gap-2 mb-3 text-blue-400">
                <Icon
                  name="mdi:eye-outline"
                  class="w-5 h-5"
                />
                <span class="text-sm">Total Views</span>
              </div>
              <div class="text-3xl font-bold text-white">
                {{ metrics.totalViews.toLocaleString() }}
              </div>
              <div class="text-sm text-gray-400 mt-1">
                {{ Math.round(metrics.totalViews / duration.value).toLocaleString() }} per month
              </div>
            </div>

            <div class="bg-slate-900/50 rounded-lg p-6 border border-blue-900/20">
              <div class="flex items-center gap-2 mb-3 text-blue-400">
                <Icon
                  name="mdi:account-multiple-outline"
                  class="w-5 h-5"
                />
                <span class="text-sm">Unique Visitors</span>
              </div>
              <div class="text-3xl font-bold text-white">
                {{ metrics.uniqueVisitors.toLocaleString() }}
              </div>
              <div class="text-sm text-gray-400 mt-1">
                {{ metrics.viewFrequency }}x average frequency
              </div>
            </div>

            <div class="bg-slate-900/50 rounded-lg p-6 border border-blue-900/20">
              <div class="flex items-center gap-2 mb-3 text-blue-400">
                <Icon
                  name="mdi:cursor-pointer"
                  class="w-5 h-5"
                />
                <span class="text-sm">Click Rate</span>
              </div>
              <div class="text-3xl font-bold text-white"> {{ metrics.clickRate }}% </div>
              <div class="text-sm text-gray-400 mt-1">
                {{ metrics.projectedClicks.toLocaleString() }} total clicks
              </div>
            </div>
          </div>
        </div>

        <!-- Audience Insights -->
        <div>
          <h3 class="text-lg font-semibold text-blue-400 mb-4">Audience Insights</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Industry Distribution -->
            <div class="bg-slate-900/50 rounded-lg p-6 border border-blue-900/20">
              <div class="flex items-center gap-2 mb-4 text-blue-400">
                <Icon
                  name="mdi:briefcase-outline"
                  class="w-5 h-5"
                />
                <span class="text-sm">Industry Distribution</span>
              </div>
              <div class="space-y-3">
                <div
                  v-for="(value, key) in metrics.industryReach"
                  :key="key"
                  class="flex justify-between"
                >
                  <span class="text-gray-400">{{ key.replace(/([A-Z])/g, ' $1').trim() }}</span>
                  <span class="text-white font-medium">{{ value }}%</span>
                </div>
              </div>
            </div>

            <!-- Geographic Reach -->
            <div class="bg-slate-900/50 rounded-lg p-6 border border-blue-900/20">
              <div class="flex items-center gap-2 mb-4 text-blue-400">
                <Icon
                  name="mdi:earth"
                  class="w-5 h-5"
                />
                <span class="text-sm">Geographic Distribution</span>
              </div>
              <div class="space-y-3">
                <div
                  v-for="(value, key) in metrics.geographicReach"
                  :key="key"
                  class="flex justify-between"
                >
                  <span class="text-gray-400">{{ key.replace(/([A-Z])/g, ' $1').trim() }}</span>
                  <span class="text-white font-medium">{{ value }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Investment Summary -->
        <div>
          <h3 class="text-lg font-semibold text-blue-400 mb-4">Investment Summary</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-slate-900/50 rounded-lg p-6 border border-blue-900/20">
              <div class="flex items-center gap-2 mb-3 text-blue-400">
                <Icon
                  name="mdi:currency-usd"
                  class="w-5 h-5"
                />
                <span class="text-sm">Total Investment</span>
              </div>
              <div class="text-3xl font-bold text-white">
                ${{ metrics.totalInvestment.toLocaleString() }}
              </div>
              <div class="text-sm text-gray-400 mt-1">
                ${{ selectedPackage.price.toLocaleString() }} per month
              </div>
            </div>

            <div class="bg-slate-900/50 rounded-lg p-6 border border-blue-900/20">
              <div class="flex items-center gap-2 mb-3 text-blue-400">
                <Icon
                  name="mdi:chart-line"
                  class="w-5 h-5"
                />
                <span class="text-sm">CPM Rate</span>
              </div>
              <div class="text-3xl font-bold text-white">${{ metrics.cpmRate.toFixed(2) }}</div>
              <div class="text-sm text-gray-400 mt-1">Cost per 1,000 views</div>
            </div>

            <div class="bg-slate-900/50 rounded-lg p-6 border border-blue-900/20">
              <div class="flex items-center gap-2 mb-3 text-blue-400">
                <Icon
                  name="mdi:trending-up"
                  class="w-5 h-5"
                />
                <span class="text-sm">Estimated ROI</span>
              </div>
              <div class="text-3xl font-bold text-white">{{ metrics.estimatedRoi }}%</div>
              <div class="text-sm text-gray-400 mt-1">Based on industry average</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="mt-12 text-center">
        <p class="text-gray-400 mb-4">Ready to get started with {{ selectedPackage.name }}?</p>
        <a
          href="#contact-form"
          class="inline-flex items-center gap-2 bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Contact Us
          <Icon name="mdi:arrow-right" />
        </a>
      </div>
    </div>
  </section>
</template>
