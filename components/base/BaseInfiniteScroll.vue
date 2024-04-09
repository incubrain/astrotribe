<template>
  <div
    ref="scrollContainer"
    class="feed-container"
  >
    <div
      v-for="item in data"
      :key="item.id"
      class="feed-item"
    >
      {{ item.content }}
    </div>
    <div v-if="isLoading">Loading more...</div>
  </div>
</template>

<script setup lang="ts">

// todo:high:1 - implement and test on component
type InfiniteScrollConfig = {
  setPageSize: number
  setPageNumber: number
}

const props = defineProps({
  apiUrl: {
    type: String,
    required: true
  },
  config: {
    type: Object,
    default: PropType<InfiniteScrollConfig>
  }
})

const page = ref(1)
const pageSize = 10
const scrollContainer = ref(null)

const { data, pending, refresh } = useAsyncData('posts', () =>
  fetch(`${props.apiUrl}?page=${page.value}&limit=${pageSize}`).then((res) => res.json())
)

const isLoading = ref(false)
watch(pending, (newVal) => {
  isLoading.value = newVal
})

function loadMore() {
  if (!isLoading.value) {
    page.value++
    refresh()
  }
}

watch(scrollContainer, (newContainer, oldContainer) => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        loadMore()
      }
    },
    {
      root: null,
      threshold: 0.5 // When 100% of the observer is visible
    }
  )

  if (oldContainer) {
    observer.unobserve(oldContainer)
  }
  if (newContainer) {
    observer.observe(newContainer)
  }
})
</script>

<style scoped>
.feed-container {
  display: flex;
  flex-direction: column;
}
.feed-item {
  margin: 10px;
  padding: 10px;
  border: 1px solid #ccc;
}
</style>
