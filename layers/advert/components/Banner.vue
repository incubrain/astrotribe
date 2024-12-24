<script setup lang="ts">
import type { Ad } from '~/types/ads'

interface Props {
  ad: Ad
  position?: 'top' | 'bottom'
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top',
})

const { trackInteraction } = useAdsStore()

// Get control variant
const variant = computed(() => props.ad.variants.find((v) => v.is_control) || props.ad.variants[0])

const handleClick = async (isVisible: boolean, startTime: number) => {
  if (!isVisible) return

  const engagementTime = (Date.now() - startTime) / 1000
  await trackInteraction(variant.value.id, 'click', engagementTime)
  window.open(variant.value.content.cta_url, '_blank')
}
</script>

<template>
  <AdsVisibilityWrapper
    v-slot="{ isVisible, startTime }"
    :variant-id="variant.id"
    :threshold="0.8"
  >
    <div
      class="bg-slate-900/80 backdrop-blur-sm border-color"
      :class="[position === 'bottom' ? 'border-t' : 'border-b']"
    >
      <div class="max-w-[940px] mx-auto px-4 py-6 md:px-8">
        <div
          class="relative overflow-hidden rounded-xl bg-slate-800/50 group hover:bg-slate-800/80 transition-all"
        >
          <!-- Background image with overlay if provided -->
          <div
            v-if="variant.content.background_image"
            class="absolute inset-0"
          >
            <img
              :src="variant.content.background_image"
              :alt="ad.company.name"
              class="w-full h-full object-cover"
            />
            <div
              class="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-slate-900/80"
            />
          </div>

          <div class="relative p-6 flex items-center justify-between">
            <div class="flex items-center gap-6">
              <div class="w-16 h-16 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
                <img
                  v-if="ad.company.logo_url"
                  :src="ad.company.logo_url"
                  :alt="ad.company.name"
                  class="w-full h-full object-cover"
                />
              </div>
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs font-medium text-blue-400">SPONSORED</span>
                  <span class="text-blue-200">•</span>
                  <span class="text-sm text-blue-200">{{ ad.company.name }}</span>
                </div>
                <h3 class="text-xl font-bold text-white mb-1">{{ variant.content.title }}</h3>
                <p class="text-blue-200 text-sm line-clamp-2">{{ variant.content.description }}</p>
              </div>
            </div>

            <button
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all group-hover:scale-105 flex items-center gap-2 text-nowrap"
              @click="() => handleClick(isVisible, startTime)"
            >
              {{ variant.content.cta_text || 'Learn More' }}
              <Icon
                name="arrow-right"
                class="w-4 h-4"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdsVisibilityWrapper>
</template>
