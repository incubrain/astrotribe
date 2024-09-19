<template>
  <div
    v-if="isVisible"
    class="flex items-center gap-2 rounded-lg bg-gray-800 p-2 text-white shadow-lg"
  >
    <div class="text-sm font-bold">
      {{ currentTask }}
    </div>
    <div class="text-xl"> ⏱️ {{ formatTime(elapsedTime) }} </div>
    <div class="flex space-x-2">
      <PrimeButton
        v-if="!isTracking"
        size="small"
        class="rounded-full bg-green-500 p-2 hover:bg-green-600"
        @click="startTimer"
      >
        <Icon
          name="mdi:play"
          size="24px"
        />
      </PrimeButton>
      <PrimeButton
        v-else
        size="small"
        class="rounded-full bg-yellow-500 p-2 hover:bg-yellow-600"
        @click="pauseTimer"
      >
        <Icon
          name="mdi:pause"
          size="24px"
        />
      </PrimeButton>
      <PrimeButton
        size="small"
        class="rounded-full bg-red-500 p-2 hover:bg-red-600"
        @click="stopTimer"
      >
        <Icon
          name="mdi:stop"
          size="24px"
        />
      </PrimeButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const isVisible = ref(true)
const isTracking = ref(false)
const elapsedTime = ref(0)
const currentTask = ref('')
let timer: NodeJS.Timeout | null = null
let startTime: number
let pausedTime = 0

function startTimer() {
  if (!isTracking.value) {
    isTracking.value = true
    startTime = Date.now() - pausedTime
    timer = setInterval(() => {
      elapsedTime.value = Math.floor((Date.now() - startTime) / 1000)
    }, 1000)
  }
}

function pauseTimer() {
  if (isTracking.value) {
    isTracking.value = false
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    pausedTime = Date.now() - startTime
  }
}

function stopTimer() {
  isTracking.value = false
  isVisible.value = false
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  elapsedTime.value = 0
  pausedTime = 0
  currentTask.value = ''
}

function showTimer(taskTitle: string) {
  currentTask.value = taskTitle
  isVisible.value = true
  startTimer()
}

function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

defineExpose({
  showTimer,
  stopTimer,
})
</script>
