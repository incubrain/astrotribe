<!-- components/AdsVariantTesting.vue -->
<script setup lang="ts">
import type { Ad } from '~/types/ads'

interface Props {
  adId: string // Changed from sponsorId to adId to match our schema
}

defineProps<Props>()

const { fetchVariantMetrics, createVariant, variants } = useAdsAdminStore()

const isLoading = ref(true)

const metrics = computed(() => {
  if (!variants.value[props.adId]) return []
  return variants.value[props.adId]
})

onMounted(async () => {
  isLoading.value = true
  await fetchVariantMetrics(props.adId)
  isLoading.value = false
})
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg p-6">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-2xl font-bold">A/B Testing</h3>
      <Button
        label="Create Variant"
        severity="primary"
        @click="() => createVariant(props.adId)"
      />
    </div>

    <div
      v-if="isLoading"
      class="p-4 text-center"
    >
      <PrimeProgressSpinner />
    </div>

    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <div
        v-for="variant in metrics"
        :key="variant.id"
        class="border rounded-lg p-4"
      >
        <div class="mb-4">
          <h4 class="font-medium mb-2">
            {{ variant.is_control ? 'Control Variant' : `Variant ${variant.id}` }}
          </h4>
          <div class="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div class="text-gray-600">Views</div>
              <div class="font-bold">{{ variant.total_views.toLocaleString() }}</div>
            </div>
            <div>
              <div class="text-gray-600">Clicks</div>
              <div class="font-bold">{{ variant.total_clicks.toLocaleString() }}</div>
            </div>
            <div>
              <div class="text-gray-600">CTR</div>
              <div class="font-bold">{{ variant.ctr }}%</div>
            </div>
          </div>
        </div>

        <AdsFeedCard :ad="{ ...ad, variants: [variant] }" />
      </div>
    </div>
  </div>
</template>
