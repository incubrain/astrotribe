<script setup lang="ts">
const route = useRoute()
const store = useAgentStore()
const agentName = route.params.name as string

const refreshInterval = ref<NodeJS.Timer>()

onMounted(async () => {
  await Promise.all([store.fetchLatestRun(agentName), store.fetchMetrics(agentName)])

  refreshInterval.value = setInterval(() => {
    store.fetchLatestRun(agentName)
  }, 30000)
})

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }
})
</script>

<template>
  <div class="p-6 bg-gray-900 min-h-screen">
    <div class="mb-6">
      <div class="flex items-center gap-4">
        <PrimeButton
          icon="pi pi-arrow-left"
          class="p-button-text text-white"
          @click="router.back()"
        />
        <h1 class="text-2xl font-bold text-white">{{ agentName }}</h1>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Latest Run -->
      <PrimeCard class="bg-gray-800 text-white">
        <template #title> Latest Run </template>
        <template #content>
          <div
            v-if="store.latestRun"
            class="space-y-4"
          >
            <div class="flex justify-between items-center">
              <span class="text-gray-400">Status:</span>
              <PrimeTag :severity="store.latestRun.status === 'completed' ? 'success' : 'danger'">
                {{ store.latestRun.status }}
              </PrimeTag>
            </div>

            <div class="space-y-2">
              <h3 class="text-sm text-gray-400">Steps:</h3>
              <div
                v-for="step in store.latestRun.steps"
                :key="step.name"
                class="p-2 bg-gray-700 rounded"
              >
                <div class="flex justify-between">
                  <span>{{ step.name }}</span>
                  <PrimeTag :severity="step.status === 'completed' ? 'success' : 'danger'">
                    {{ step.status }}
                  </PrimeTag>
                </div>
                <div
                  v-if="step.error"
                  class="mt-2 text-sm text-red-400"
                >
                  {{ step.error.message }}
                </div>
              </div>
            </div>
          </div>
          <div
            v-else
            class="text-center text-gray-400"
          >
            No run data available
          </div>
        </template>
      </PrimeCard>

      <!-- Metrics -->
      <PrimeCard class="bg-gray-800 text-white">
        <template #title> 24h Metrics </template>
        <template #content>
          <div
            v-if="store.metrics"
            class="space-y-4"
          >
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 bg-gray-700 rounded">
                <h3 class="text-sm text-gray-400">Success Rate</h3>
                <p class="text-2xl mt-1">
                  {{ ((store.metrics.success / store.metrics.total) * 100).toFixed(1) }}%
                </p>
              </div>

              <div class="p-4 bg-gray-700 rounded">
                <h3 class="text-sm text-gray-400">Avg Duration</h3>
                <p class="text-2xl mt-1"> {{ (store.metrics.avgDuration / 1000).toFixed(1) }}s </p>
              </div>
            </div>
          </div>
          <div
            v-else
            class="text-center text-gray-400"
          >
            No metrics available
          </div>
        </template>
      </PrimeCard>
    </div>
  </div>
</template>
