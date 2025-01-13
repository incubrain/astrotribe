// pages/agents/index.vue
<script setup lang="ts">
const store = useAgentStore()
const router = useRouter()

const { agents } = storeToRefs(store.state)

// Auto-refresh every minute
const refreshInterval = ref<NodeJS.Timer>()

onMounted(async () => {
  await store.fetchAgents()
  refreshInterval.value = setInterval(() => {
    store.fetchAgents()
  }, 60000)
})

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }
})

const getStatusClass = (status: string) => {
  switch (status) {
    case 'running':
      return 'bg-blue-600'
    case 'failed':
      return 'bg-red-600'
    default:
      return 'bg-green-600'
  }
}
</script>

<template>
  <div class="p-6 bg-gray-900 min-h-screen">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white">Agent Monitoring</h1>
      <p class="text-gray-400">Overview of all agent statuses and performance</p>
    </div>

    <PrimeCard class="bg-gray-800 text-white">
      <template #content>
        <div
          v-if="store.loading"
          class="flex justify-center p-4"
        >
          <PrimeProgressSpinner />
        </div>

        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <PrimeCard
            v-for="agent in agents"
            :key="agent.name"
            class="bg-gray-700 hover:bg-gray-600 cursor-pointer transition-colors"
            @click="router.push(`/agents/${agent.name}`)"
          >
            <template #title>
              <div class="flex items-center gap-2">
                <div :class="[getStatusClass(agent.status), 'w-3 h-3 rounded-full']" />
                <span>{{ agent.name }}</span>
              </div>
            </template>

            <template #content>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-400">Last Run:</span>
                  <span>{{ new Date(agent.lastRunAt).toLocaleString() }}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-400">24h Success Rate:</span>
                  <span
                    >{{ ((agent.stats24h.success / agent.stats24h.total) * 100).toFixed(1) }}%</span
                  >
                </div>

                <div
                  v-if="agent.lastError"
                  class="mt-4 p-2 bg-red-900/50 rounded"
                >
                  <p class="text-sm text-red-400">{{ agent.lastError.message }}</p>
                </div>
              </div>
            </template>
          </PrimeCard>
        </div>
      </template>
    </PrimeCard>
  </div>
</template>
