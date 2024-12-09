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

const supabase = useSupabaseClient()
const todaysPosts = ref(0)
const currentTime = ref(new Date())

const formattedTime = computed(() => {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZoneName: 'short',
  }).format(currentTime.value)
})

const fetchTodaysPosts = async () => {
  // Get the start and end of today in the user's timezone
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const endOfDay = new Date(startOfDay)
  endOfDay.setDate(startOfDay.getDate() + 1)

  // Convert to ISO strings for Supabase
  const startISO = startOfDay.toISOString()
  const endISO = endOfDay.toISOString()

  let query = supabase
    .from('news')
    .select('id', { count: 'exact', head: true })
    .gte('published_at', startISO)
    .lt('published_at', endISO)
    .not('body', 'is', null)

  // Add filters if this is a custom feed
  if (props.filters.categories?.length || props.filters.sources?.length) {
    const filters: any = { or: [] }

    if (props.filters.categories?.length) {
      filters.or.push({
        category_id: { in: props.filters.categories.map((c) => c.id) },
      })
    }

    if (props.filters.sources?.length) {
      filters.or.push({
        content_source_id: { in: props.filters.sources.map((s) => s.id) },
      })
    }

    // Apply the filters
    query = query.or(filters.or.map((f) => Object.entries(f)[0].join('.eq.')).join(','))
  }

  const { count, error } = await query

  if (error) {
    console.error("Error fetching today's posts:", error)
    return
  }

  todaysPosts.value = count || 0
}

let timeTimer: NodeJS.Timer
let postTimer: NodeJS.Timer

onMounted(() => {
  // Initial fetch
  fetchTodaysPosts()

  // Update time every minute
  timeTimer = setInterval(() => {
    currentTime.value = new Date()
  }, 60000)

  // Update post count every 5 minutes
  postTimer = setInterval(() => {
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
