<script setup lang="ts">
import type { AdPackage } from '~/types/ads'

const { adPackages, isLoading } = storeToRefs(useAdsStore())
const { selectedPackageId, selectPackage } = useAdvertising()

const handleSelectPackage = (packageId: string) => {
  selectPackage(packageId)
  // Scroll to calculator
  const calculator = document.querySelector('#impact-calculator')
  calculator?.scrollIntoView({ behavior: 'smooth' })
}

// Position-based configuration for order and badges
const POSITION_CONFIG = {
  top: { order: 1, highlight: true },
  feed: { order: 2, badge: 'Most Popular' },
  newsletter: { order: 3 },
} as const

// Feature icons mapping
const FEATURE_ICONS = {
  placement: 'mdi:view-dashboard-outline',
  visibility: 'mdi:eye-outline',
  branding: 'mdi:palette-outline',
  testing: 'mdi:ab-testing',
  analytics: 'mdi:chart-line',
  support: 'mdi:headphones',
  integration: 'mdi:layers-outline',
  tracking: 'mdi:trending-up',
  templates: 'mdi:email-outline',
  audience: 'mdi:account-group-outline',
} as const

// Get appropriate icon for a feature
const getFeatureIcon = (feature: string) => {
  const key = Object.keys(FEATURE_ICONS).find((k) => feature.toLowerCase().includes(k))
  return FEATURE_ICONS[key as keyof typeof FEATURE_ICONS] || 'mdi:check-circle-outline'
}

const formattedPackages = computed(() => {
  return adPackages.value
    .filter((pkg) => pkg.active)
    .map((pkg) => ({
      ...pkg,
      badge: POSITION_CONFIG[pkg.position as keyof typeof POSITION_CONFIG]?.badge || '',
      highlight: POSITION_CONFIG[pkg.position as keyof typeof POSITION_CONFIG]?.highlight || false,
    }))
    .sort((a, b) => {
      const orderA = POSITION_CONFIG[a.position as keyof typeof POSITION_CONFIG]?.order || 99
      const orderB = POSITION_CONFIG[b.position as keyof typeof POSITION_CONFIG]?.order || 99
      return orderA - orderB
    })
})
</script>

<template>
  <section class="wrapper mx-auto py-16">
    <h2 class="text-2xl md:text-3xl font-bold mb-4 text-center">Launch Packages</h2>
    <p class="text-gray-400 text-center mb-12">Choose your trajectory in the advertising cosmos</p>

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

    <!-- Packages Grid -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      <div
        v-for="pkg in formattedPackages"
        :key="pkg.id"
        class="relative group"
      >
        <!-- Card Container with conditional highlighting -->
        <div
          class="h-full flex flex-col rounded-lg border transition-all duration-300 relative"
          :class="[
            pkg.highlight
              ? 'bg-gradient-to-b from-slate-800 to-slate-900 border-slate-400/30 shadow-lg shadow-slate-500/10'
              : 'bg-[#0A1021] border-blue-900/30 hover:border-blue-500/30',
          ]"
        >
          <!-- Most Popular Badge -->
          <PrimeBadge
            v-if="pkg.badge"
            :value="pkg.badge"
            severity="info"
            size="small"
            class="absolute -top-3 right-4 bg-blue-500 text-white border-none px-4 uppercase"
          />

          <!-- Card Content -->
          <div class="p-6 flex-grow flex flex-col">
            <div class="flex-grow">
              <h3 class="text-xl font-bold mb-2">{{ pkg.name }}</h3>
              <p class="text-gray-400 text-sm mb-4">{{ pkg.description }}</p>

              <div class="text-3xl font-bold text-white mb-6">
                ${{ pkg.price.toLocaleString() }}<span class="text-lg text-gray-400">/month</span>
              </div>

              <ul class="space-y-3 mb-8">
                <li
                  v-for="feature in pkg.features"
                  :key="feature"
                  class="flex items-start gap-3 text-sm text-gray-300"
                >
                  <div
                    class="p-1 rounded-lg flex bg-blue-500/10 flex-shrink-0"
                    :class="{ 'bg-slate-400/10': pkg.highlight }"
                  >
                    <Icon
                      :name="getFeatureIcon(feature)"
                      class="flex"
                      size="20px"
                      :class="pkg.highlight ? 'text-slate-300' : 'text-blue-400'"
                    />
                  </div>
                  <span>{{ feature }}</span>
                </li>
              </ul>
            </div>

            <!-- Button always at bottom -->
            <button
              class="w-full px-4 py-2 rounded-lg transition-colors"
              :class="[
                selectedPackageId === pkg.id
                  ? 'bg-blue-500 text-white'
                  : pkg.highlight
                    ? 'bg-gradient-to-r from-slate-300 to-slate-400 text-slate-900 hover:from-slate-200 hover:to-slate-300'
                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20',
              ]"
              @click="handleSelectPackage(pkg.id)"
            >
              {{ selectedPackageId === pkg.id ? 'Selected' : 'Select Package' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- No Packages State -->
    <div
      v-if="!isLoading && formattedPackages.length === 0"
      class="text-center py-12 text-gray-400"
    >
      No packages available at this time. Please check back later.
    </div>
  </section>
</template>
