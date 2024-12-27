<script setup lang="ts">
const props = defineProps<{
  goal: Goal
}>()

const emit = defineEmits<{
  (e: 'update:timeSpent', time: number): void
}>()

const isTracking = ref(false)
let timer: NodeJS.Timeout | null = null
let startTime: number

const startGlobalTimer = inject('startGlobalTimer') as (taskTitle: string) => void
const stopGlobalTimer = inject('stopGlobalTimer') as () => void

function startTimer() {
  if (import.meta.client) {
    isTracking.value = true
    startTime = Date.now()
    timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 60000)
      emit('update:timeSpent', props.goal.timeSpent + elapsed)
    }, 60000)
    startGlobalTimer(props.goal.title)
  }
}

function stopTimer() {
  if (timer) {
    clearInterval(timer)
    const elapsed = Math.floor((Date.now() - startTime) / 60000)
    emit('update:timeSpent', props.goal.timeSpent + elapsed)
  }
  isTracking.value = false
  stopGlobalTimer()
}

function formatTime(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}h ${remainingMinutes}m`
}
</script>

<template>
  <div class="flex flex-col space-y-2">
    <h3 class="text-lg font-semibold"> Time Spent: {{ formatTime(goal.timeSpent) }} </h3>
    <div class="flex space-x-2">
      <PrimeButton
        class="rounded-full bg-green-500 p-2 hover:bg-green-600"
        @click="startTimer"
      >
        <Icon
          name="mdi:play"
          size="24px"
        />
      </PrimeButton>
      <PrimeButton
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
