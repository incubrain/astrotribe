<script setup lang="ts">
import type { StoreKey } from '@/composables/base/pagination.base.store'

const props = defineProps({
  pagination: {
    type: Object as PropType<{ page: number; limit: number }>,
    required: true
  },
  storeKey: {
    type: String as PropType<StoreKey>,
    required: true
  }
})

const paginationStore = usePaginationStore()

watch(
  props,
  () => {
    paginationStore.initPagination({
      storeKey: props.storeKey,
      pagination: props.pagination,
      force: true
    })
  },
  { immediate: true, deep: true }
)

const emit = defineEmits(['update:scrollEnd'])
const scrollContainer = ref(null)
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        emit('update:scrollEnd')
      }
    },
    {
      root: null,
      threshold: 1
    }
  )

  if (scrollContainer.value) {
    observer.observe(scrollContainer.value)
  }

  // Cleanup observer on component unmount
  onUnmounted(() => {
    if (scrollContainer.value) {
      observer.unobserve(scrollContainer.value)
    }
  })
})
</script>

<template>
  <div>
    <slot />
    <div ref="scrollContainer" />
  </div>
</template>
<style></style>
