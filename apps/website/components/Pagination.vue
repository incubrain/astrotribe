<script setup lang="ts">
// Props
const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  baseUrl: {
    type: String,
    required: true,
  },
  maxVisible: {
    type: Number,
    default: 5,
  },
})

// Calculate visible page numbers
const visiblePages = computed(() => {
  const halfMax = Math.floor(props.maxVisible / 2)
  let start = Math.max(1, props.currentPage - halfMax)
  const end = Math.min(props.totalPages, start + props.maxVisible - 1)

  // Adjust start if we're near the end
  if (end - start + 1 < props.maxVisible) {
    start = Math.max(1, end - props.maxVisible + 1)
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

// Generate URL for a specific page
const getPageUrl = (page: number) => {
  if (page === 1) {
    // Remove the page path for page 1, to go back to the index
    return props.baseUrl.replace(/\/page\/\d+$/, '')
  }
  return `${props.baseUrl}/${page}`
}

// Check if we should show the first page shortcut
const showFirstPage = computed(() => visiblePages.value.length > 0 && visiblePages.value[0] > 1)

// Check if we should show the last page shortcut
const showLastPage = computed(
  () =>
    visiblePages.value.length > 0 &&
    visiblePages.value[visiblePages.value.length - 1] < props.totalPages,
)
</script>

<template>
  <div
    v-if="totalPages > 1"
    class="wrapper flex items-center justify-center py-12"
  >
    <nav
      aria-label="Pagination"
      class="inline-flex items-center gap-2"
    >
      <!-- Previous page button -->
      <NuxtLink
        v-if="currentPage > 1"
        :to="getPageUrl(currentPage - 1)"
        class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-950 text-white transition hover:bg-primary-900"
        aria-label="Previous page"
      >
        <Icon
          name="i-lucide-chevron-left"
          class="h-5 w-5"
        />
      </NuxtLink>
      <span
        v-else
        class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-950/50 text-gray-500 cursor-not-allowed"
      >
        <Icon
          name="i-lucide-chevron-left"
          class="h-5 w-5"
        />
      </span>

      <!-- First page + ellipsis -->
      <template v-if="showFirstPage">
        <NuxtLink
          :to="getPageUrl(1)"
          class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-950 text-white transition hover:bg-primary-900"
          :class="{ 'bg-primary-600': currentPage === 1 }"
        >
          1
        </NuxtLink>
        <span
          v-if="visiblePages[0] > 2"
          class="inline-flex h-10 items-center justify-center text-gray-400"
        >
          ...
        </span>
      </template>

      <!-- Visible page numbers -->
      <NuxtLink
        v-for="page in visiblePages"
        :key="`page-${page}`"
        :to="getPageUrl(page)"
        class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-950 text-white transition hover:bg-primary-900"
        :class="{ 'bg-primary-600': currentPage === page }"
        :aria-current="currentPage === page ? 'page' : undefined"
      >
        {{ page }}
      </NuxtLink>

      <!-- Last page + ellipsis -->
      <template v-if="showLastPage">
        <span
          v-if="visiblePages[visiblePages.length - 1] < totalPages - 1"
          class="inline-flex h-10 items-center justify-center text-gray-400"
        >
          ...
        </span>
        <NuxtLink
          :to="getPageUrl(totalPages)"
          class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-950 text-white transition hover:bg-primary-900"
          :class="{ 'bg-primary-600': currentPage === totalPages }"
        >
          {{ totalPages }}
        </NuxtLink>
      </template>

      <!-- Next page button -->
      <NuxtLink
        v-if="currentPage < totalPages"
        :to="getPageUrl(currentPage + 1)"
        class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-950 text-white transition hover:bg-primary-900"
        aria-label="Next page"
      >
        <Icon
          name="i-lucide-chevron-right"
          class="h-5 w-5"
        />
      </NuxtLink>
      <span
        v-else
        class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-950/50 text-gray-500 cursor-not-allowed"
      >
        <Icon
          name="i-lucide-chevron-right"
          class="h-5 w-5"
        />
      </span>
    </nav>
  </div>
</template>
