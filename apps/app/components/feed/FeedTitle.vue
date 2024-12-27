<script setup lang="ts">
// components/FeedTitle.vue
interface Props {
  title: string
  filters?: {
    categories?: Array<{ id: number }>
    sources?: Array<{ id: number }>
  }
}

const props = withDefaults(defineProps<Props>(), {
  title: 'News Feed',
  filters: () => ({}),
})

const currentTime = ref(new Date())

const formattedTime = computed(() => {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZoneName: 'short',
  }).format(currentTime.value)
})

const { todaysPosts, fetchTodaysPosts, hasInitialized } = useTodaysPosts(props.filters)

let timeTimer: NodeJS.Timer
let postTimer: NodeJS.Timer

onMounted(() => {
  // Initial fetch
  fetchTodaysPosts()

  // Update time every minute
  timeTimer = setInterval(() => {
    currentTime.value = new Date()
  }, 60000)

  // Update post count every 5 minutes, but only after initial mount
  postTimer = setInterval(() => {
    hasInitialized.value = false // Reset the flag for periodic updates
    fetchTodaysPosts()
  }, 300000)
})

onUnmounted(() => {
  clearInterval(timeTimer)
  clearInterval(postTimer)
})
</script>

<template>
  <div class="bg-primary-950">
    <div class="max-w-[940px] mx-auto px-4 py-6 md:px-8">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-white">{{ title }}</h1>
        <div class="text-gray-400 text-sm space-y-1 text-right">
          <div>{{ formattedTime }}</div>
          <div>{{ todaysPosts }} posts today</div>
        </div>
      </div>
    </div>
  </div>
</template>
