<!-- components/AdsFeedCard.vue -->
<script setup lang="ts">
import type { Ad } from '~/types/ads'

interface Props {
  ad: Ad
}

const props = defineProps<Props>()
const ads = useAdsStore()
const { currentAdQueue } = storeToRefs(ads)

const isFlipped = ref(false)
const startTime = ref(Date.now())
const flipStartTime = ref(0)

// Get control variant
const variant = computed(() => props.ad.variants.find((v) => v.is_control) || props.ad.variants[0])

const handleClick = async (event: MouseEvent, isVisible: boolean, startTime: number) => {
  if (!isVisible) return

  const target = event.target as HTMLElement
  if (target.closest('a') || target.closest('button')) {
    event.stopPropagation()
    return
  }

  isFlipped.value = !isFlipped.value
  if (isFlipped.value) {
    flipStartTime.value = Date.now()
  } else if (flipStartTime.value > 0) {
    const flipEngagementTime = (Date.now() - flipStartTime.value) / 1000
    await ads.trackInteraction(variant.value.id, 'view', flipEngagementTime)
  }
}

const handleSourceVisit = async (isVisible: boolean, startTime: number) => {
  if (!isVisible) return
  const engagementTime = (Date.now() - startTime) / 1000
  await ads.trackInteraction(variant.value.id, 'click', engagementTime)
}

const handleMouseEnter = () => {
  isFlipped.value = true
  flipStartTime.value = Date.now()
}

const handleMouseLeave = () => {
  isFlipped.value = false
  if (flipStartTime.value > 0) {
    // Track engagement time when mouse leaves
    const flipEngagementTime = (Date.now() - flipStartTime.value) / 1000
    ads.trackInteraction(variant.value.id, 'view', flipEngagementTime)
    flipStartTime.value = 0
  }
}

// Track initial view
onMounted(() => {
  ads.trackInteraction(variant.value.id, 'view')
})

// Track final engagement time when component is unmounted
onBeforeUnmount(() => {
  const totalEngagementTime = (Date.now() - startTime.value) / 1000
  ads.trackInteraction(variant.value.id, 'view', totalEngagementTime)
})
</script>

<template>
  <AdsVisibilityWrapper
    v-slot="{ isVisible, startTime }"
    :variant-id="variant.id"
    :threshold="0.5"
  >
    <div
      class="group relative h-[450px] perspective-1000 hover:cursor-pointer foreground rounded-lg"
      @click="(e) => handleClick(e, isVisible, startTime)"
      @mouseenter="
        () => {
          if (isVisible) isFlipped = true
        }
      "
      @mouseleave="
        () => {
          if (isVisible) isFlipped = false
        }
      "
    >
      <div
        class="relative w-full h-full transition-all duration-500 transform-style-preserve-3d border-2 border-blue-500/30 rounded-lg"
        :class="[{ 'rotate-y-180': isFlipped }]"
      >
        <!-- Front of card -->
        <div class="absolute w-full h-full backface-hidden">
          <div class="p-4 flex flex-col justify-between h-full">
            <div>
              <div
                v-if="ad.company"
                class="flex items-center gap-2 mb-2"
              >
                <div class="flex-shrink-0 w-6 h-6 rounded-full overflow-hidden">
                  <img
                    :src="ad.company.logo_url"
                    :alt="ad.company.name"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-medium text-sm">{{ ad.company.name }}</span>
                  <span class="text-xs text-blue-500 font-medium">SPONSORED</span>
                </div>
              </div>
              <h3
                class="text-xl font-bold mb-2 line-clamp-3 min-h-[3.5rem]"
                :title="variant.content.title"
              >
                {{ variant.content.title }}
              </h3>
              <p>{{ variant.content.tagline }}</p>
            </div>
            <div>
              <div class="mb-4">
                <div class="relative w-full pb-[56.25%]">
                  <img
                    :src="variant.content.featured_image"
                    :alt="variant.content.title"
                    class="absolute inset-0 w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
              <div class="flex w-full">
                <a
                  :href="variant.content.cta_url"
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  class="bg-blue-600 text-white px-4 flex justify-center items-center w-full py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  @click="() => handleSourceVisit(isVisible, startTime)"
                >
                  {{ variant.content.cta_text || 'Learn More' }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Back of card -->
        <div
          class="absolute w-full h-full backface-hidden rotate-y-180 bg-primary-950 rounded-lg p-4 flex flex-col"
        >
          <div class="flex-grow overflow-hidden flex flex-col">
            <h3 class="text-xl font-bold mb-4 line-clamp-3 min-h-[3.5rem]">
              {{ variant.content.title }}
            </h3>
            <p class="text-base overflow-y-auto flex-grow">
              {{ variant.content.description }}
            </p>
          </div>

          <div class="border-t border-primary-900 pt-4">
            <a
              :href="variant.content.cta_url"
              target="_blank"
              rel="noopener noreferrer sponsored"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full inline-block text-center"
              @click="(e) => handleSourceVisit(isVisible, startTime)"
            >
              {{ variant.content.cta_text || 'Learn More' }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </AdsVisibilityWrapper>
</template>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}

.transform-style-preserve-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}
</style>
