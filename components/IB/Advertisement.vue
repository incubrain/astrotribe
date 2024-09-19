<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useStorage } from '@vueuse/core'
import advertisements from '~/assets/advertisements.json'

const showAds = ref(true)

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
    await $fetch('/api/admin/advertisement/metrics', {
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

onMounted(() => {
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

const intervalId = setInterval(sendMetrics, sendInterval)

onUnmounted(() => {
  clearInterval(intervalId)
  sendMetrics() // Send any remaining metrics before unmounting
})
</script>

<template>
  <aside class="w-72 p-4">
    <div
      v-for="ad in activeAds"
      :key="ad.id"
      class="mb-6 overflow-hidden rounded-lg"
    >
      <a
        :href="showAds ? ad.link : undefined"
        target="_blank"
        rel="noopener noreferrer"
        class="block h-full"
        :class="{ invisible: !showAds }"
        @click="trackInteraction(ad.id)"
      >
        <div class="h-40 w-full">
          <img
            v-if="showAds"
            :src="ad.imageUrl"
            :alt="ad.title"
            class="h-full w-full object-cover"
          />
        </div>
        <div class="p-4">
          <h3
            v-if="showAds"
            class="text-lg mb-2 font-semibold text-gray-800"
          >
            {{ ad.title }}
          </h3>
          <p
            v-if="showAds"
            class="text-sm text-gray-600"
          >
            {{ ad.description }}
          </p>
        </div>
      </a>
    </div>
  </aside>
</template>
