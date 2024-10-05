<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import advertisements from '../assets/advertisements.json'

const showAds = ref(false)
const userShowAds = useStorage('userShowAds', true)

interface Advertisement {
  id: number
  title: string
  description: string
  imageUrl: string
  link: string
  active: boolean
}

interface AdMetric {
  adId: number
  impressions: number
  clicks: number
  uniqueViews: number // Changed to number
  deviceType: string
  viewTimes: number[]
}

const activeAds = ref<Advertisement[]>([])
const adMetrics = useStorage<Record<number, AdMetric>>('adMetrics', {})
const viewedAds = useStorage<Set<number>>('viewedAds', new Set())
const sendInterval = 10000 // 10 seconds

const loadActiveAds = () => {
  activeAds.value = advertisements.filter((ad) => ad.active).slice(0, 3)
}

const getDeviceType = () => {
  const userAgent = navigator.userAgent
  if (/mobile/i.test(userAgent)) return 'Mobile'
  if (/tablet/i.test(userAgent)) return 'Tablet'
  return 'Desktop'
}

const trackImpression = (adId: number) => {
  if (!adMetrics.value[adId]) {
    adMetrics.value[adId] = {
      adId,
      impressions: 0,
      clicks: 0,
      uniqueViews: 0,
      deviceType: getDeviceType(),
      viewTimes: [],
    }
  }
  adMetrics.value[adId].impressions++
  adMetrics.value[adId].viewTimes.push(Date.now())

  // Increment uniqueViews only if it's the first time this ad is viewed
  if (!viewedAds.value.has(adId)) {
    adMetrics.value[adId].uniqueViews++
    viewedAds.value.add(adId)
  }
}

const trackInteraction = (adId: number) => {
  if (adMetrics.value[adId]) {
    adMetrics.value[adId].clicks++
  }
}

const sendMetrics = async () => {
  const metricsToSend = JSON.parse(JSON.stringify(adMetrics.value))

  try {
    // Send metrics to admin server (not implemented)
    await $fetch('/api/advertisement/metrics', {
      method: 'POST',
      body: { metrics: metricsToSend },
    })

    console.log('Metrics sent successfully')
    // Clear the local metrics after successful send
    adMetrics.value = {}
  } catch (error) {
    console.error('Failed to send metrics:', error)
  }
}

const intervalId = ref(null as NodeJS.Timeout | null)
onMounted(() => {
  intervalId.value = setInterval(sendMetrics, sendInterval)
  loadActiveAds()
  activeAds.value.forEach((ad) => trackImpression(ad.id))
})

watch(
  activeAds,
  (newAds) => {
    newAds.forEach((ad) => trackImpression(ad.id))
  },
  { deep: true },
)

onUnmounted(() => {
  clearInterval(intervalId.value!)
  sendMetrics() // Send any remaining metrics before unmounting
})
</script>

<template>
  <aside class="mx-auto min-h-72 w-72 space-y-4 p-4">
    <div class="mb-4 flex items-center justify-between">
      <label
        for="show-ads-toggle"
        class="pr-2 text-sm"
      >
        Toggle Ads
      </label>
      <PrimeToggleSwitch
        v-model="showAds"
        input-id="show-ads-toggle"
      />
    </div>
    <div
      v-for="ad in activeAds"
      :key="ad.id"
      class="border-color overflow-hidden rounded-lg"
      :class="!showAds ? '' : 'border'"
    >
      <a
        :href="showAds ? ad.link : undefined"
        target="_blank"
        rel="noopener noreferrer"
        class="block h-full w-full"
        :class="{ invisible: !showAds }"
        @click="trackInteraction(ad.id)"
      >
        <div class="max-h-72 w-full">
          <NuxtImg
            v-if="showAds"
            :src="ad.imageUrl"
            :alt="ad.title"
            class="w-full object-cover"
          />
        </div>
        <div class="p-4">
          <h3
            v-if="showAds"
            class="text-lg font-semibold"
          >
            {{ ad.title }}
          </h3>
          <p
            v-if="showAds"
            class="text-sm"
          >
            {{ ad.description }}
          </p>
        </div>
      </a>
    </div>
  </aside>
</template>
