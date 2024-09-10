<template>
  <div
    class="fixed bottom-5 right-5 z-50 flex cursor-pointer gap-2 rounded-full bg-blue-500 p-3 text-white"
  >
    <DevApiDataViewer />
    <IbGlobalTimer ref="globalTimer" />
  </div>
</template>

<script setup lang="ts">
const showPlayground = ref(true)

// You might want to add a method to toggle the playground
const togglePlayground = () => {
  showPlayground.value = !showPlayground.value
}

const globalTimer = ref<InstanceType<typeof IBGlobalTimer> | null>(null)

function startGlobalTimer(taskTitle: string) {
  globalTimer.value?.showTimer(taskTitle)
}

function stopGlobalTimer() {
  globalTimer.value?.stopTimer()
}

provide('startGlobalTimer', startGlobalTimer)
provide('stopGlobalTimer', stopGlobalTimer)
</script>

<style scoped></style>
