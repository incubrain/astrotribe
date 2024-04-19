<template>
  <div>
    <ul v-if="items.length">
      <li
        v-for="item in items"
        :key="item.id"
        >{{ item.content }}</li
      >
    </ul>
    <button @click="loadMore">Load More</button>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// todo:high:1 - implement and test on component

const route = useRoute()
const slug = route.params.slug // Dynamic slug based on the current route
const items = ref([])
const currentPage = ref(1)

// Store and restore pagination state using session storage
const sessionStorageKey = `pagination-${slug}`

function restoreState() {
  const savedState = sessionStorage.getItem(sessionStorageKey)
  if (savedState) {
    const state = JSON.parse(savedState)
    currentPage.value = state.currentPage
    items.value = state.items
  }
}

function storeState() {
  const state = {
    currentPage: currentPage.value,
    items: items.value
  }
  sessionStorage.setItem(sessionStorageKey, JSON.stringify(state))
}

async function fetchItems() {
  // Placeholder function to simulate fetching items
  const newItems = [{ id: Date.now(), content: `Item ${currentPage.value}` }]
  items.value.push(...newItems)
  currentPage.value += 1
  storeState()
}

function loadMore() {
  fetchItems()
}

onMounted(() => {
  restoreState()
  if (items.value.length === 0) {
    fetchItems()
  }
})
</script>
