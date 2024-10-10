<template>
  <nav class="pagination">
    <ul class="pagination-list">
      <li v-if="currentPage > 1">
        <NuxtLink :to="`${baseUrl}/page/${currentPage - 1}`">Previous</NuxtLink>
      </li>
      <li
        v-for="page in pages"
        :key="page"
      >
        <NuxtLink
          :to="`${baseUrl}/page/${page}`"
          :class="{ 'is-current': page === currentPage }"
        >
          {{ page }}
        </NuxtLink>
      </li>
      <li v-if="currentPage < totalPages">
        <NuxtLink :to="`${baseUrl}/page/${currentPage + 1}`">Next</NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
const p = defineProps<{
  currentPage: number
  totalPages: number
  baseUrl: string
}>()

const pages = computed(() => {
  const pagesArray = []
  for (let i = 1; i <= p.totalPages; i++) {
    pagesArray.push(i)
  }
  return pagesArray
})
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination-list {
  display: flex;
  list-style: none;
}

.pagination-list li {
  margin: 0 5px;
}

.pagination-list .is-current {
  font-weight: bold;
}
</style>
