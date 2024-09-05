<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">
      Instagram Profile Metrics
    </h1>
    <div
      v-if="instagram"
      class="mb-4"
    >
      <PrimeCard>
        <template #header>
          <h2 class="text-xl font-semibold">
            Profile Statistics
          </h2>
        </template>
        <p>Followers Count: {{ instagram.analytics.followers_count }}</p>
        <p>Media Count: {{ instagram.analytics.media_count }}</p>
        <p>Follows Count: {{ instagram.analytics.follows_count }}</p>
      </PrimeCard>
    </div>
    <div v-if="instagram && instagram.insights.length">
      <h2 class="text-xl font-semibold mb-2">
        Recent Insights
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <PrimeCard
          v-for="insight in instagram.insights"
          :key="insight.id"
          class="w-full"
        >
          <template #header>
            <h3 class="text-lg font-medium">
              {{ insight.title }}
            </h3>
          </template>
          <p>Value: {{ insight.values[0].value }}</p>
          <p>Period: {{ insight.period }}</p>
          <p>End Time: {{ new Date(insight.values[0].end_time).toLocaleDateString() }}</p>
        </PrimeCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  userId: {
    type: String,
    required: true
  }
})

const social = useSocialStore()
const { instagram } = storeToRefs(social)

onMounted(() => {
  social.getInstagramAnalytics(props.userId)
})
</script>

<style scoped></style>
