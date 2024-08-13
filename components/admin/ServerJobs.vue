<template>
  <div class="p-4">
    <h1 class="mb-4 text-2xl font-bold">Jobs Dashboard</h1>
    <div
      v-if="jobMetrics"
      class="grid grid-cols-1 gap-4 md:grid-cols-2"
    >
      <div
        v-for="(queue, queueName) in jobMetrics"
        :key="queueName"
        class="rounded-lg background p-4 shadow"
      >
        <h2 class="mb-2 text-xl font-semibold capitalize">{{ queueName }} Queue</h2>
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="(value, key) in queue"
            :key="key"
            class="rounded foreground p-2"
          >
            <span class="font-medium capitalize">{{ key }}:</span> {{ value }}
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="text-center text-gray-500"
    >
      Loading job metrics...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const jobMetrics = ref(null)
let socket = null

onMounted(() => {
  socket = new WebSocket(`ws://${window.location.host}/api/admin/server-jobs`)

  socket.onopen = () => {
    console.log('WebSocket connected')
  }

  socket.onmessage = (event) => {
    jobMetrics.value = JSON.parse(event.data)
    console.log('jobMetrics', jobMetrics.value)
  }

  socket.onerror = (error) => {
    console.error('WebSocket error:', error)
  }

  socket.onclose = () => {
    console.log('WebSocket disconnected')
  }
})

onUnmounted(() => {
  if (socket) {
    socket.close()
  }
})
</script>
