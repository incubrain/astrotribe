<script setup lang="ts">
import { ref, computed } from 'vue'

interface TestData {
  id: string | number
  [key: string]: any
}

// Test configuration options
const testConfig = ref({
  tableName: 'user_profiles', // can be changed to test different tables
  columns: '*',
  enablePagination: true,
  pageSize: 20,
  enableOrdering: true,
  orderColumn: 'created_at',
  orderAscending: false,
  enableFilters: false,
  filterColumn: '',
  filterValue: '',
})

// Computed configuration object for useSelectData
const selectConfig = computed(() => {
  const paginationConfig = testConfig.value.enablePagination
    ? { page: 1, limit: testConfig.value.pageSize }
    : undefined

  const orderByConfig = testConfig.value.enableOrdering
    ? {
        column: testConfig.value.orderColumn,
        ascending: testConfig.value.orderAscending,
      }
    : undefined

  const filtersConfig =
    testConfig.value.enableFilters && testConfig.value.filterColumn
      ? {
          [testConfig.value.filterColumn]: { eq: testConfig.value.filterValue },
        }
      : undefined

  return {
    columns: testConfig.value.columns,
    initialFetch: true,
    pagination: paginationConfig,
    orderBy: orderByConfig,
    filters: filtersConfig,
  }
})

// Initialize useSelectData with the computed config
const { store, loadMore, refresh, isSelecting } = useSelectData<TestData>(
  testConfig.value.tableName,
  selectConfig.value,
)

// Get the items from the store
const { items } = storeToRefs(store)

// Debug logging
watch(
  items,
  (newItems) => {
    console.log('Items updated:', newItems)
  },
  { deep: true },
)

// Methods
const handleRefresh = async () => {
  console.log('Refreshing with config:', selectConfig.value)
  await refresh()
}

const handleLoadMore = async () => {
  console.log('Loading more with config:', selectConfig.value)
  await loadMore()
}

const switchTable = (newTable: string) => {
  testConfig.value.tableName = newTable
  refresh()
}
</script>

<template>
  <div class="p-4">
    <div class="mb-8 space-y-4 bg-gray-100 p-4 rounded-lg">
      <h2 class="text-xl font-bold">Test Configuration</h2>

      <!-- Table Selection -->
      <div class="flex gap-4 items-center">
        <label class="font-medium">Table:</label>
        <select
          v-model="testConfig.tableName"
          class="border rounded p-1"
        >
          <option value="user_profiles">Users</option>
          <option value="news">News</option>
          <option value="comments">Comments</option>
        </select>
      </div>

      <!-- Columns -->
      <div class="flex gap-4 items-center">
        <label class="font-medium">Columns:</label>
        <input
          v-model="testConfig.columns"
          class="border rounded p-1"
          placeholder="e.g. id, name, email"
        />
      </div>

      <!-- Pagination -->
      <div class="space-y-2">
        <div class="flex gap-4 items-center">
          <label class="font-medium">Enable Pagination:</label>
          <input
            type="checkbox"
            v-model="testConfig.enablePagination"
          />
        </div>
        <div
          v-if="testConfig.enablePagination"
          class="flex gap-4 items-center ml-4"
        >
          <label>Page Size:</label>
          <input
            type="number"
            v-model="testConfig.pageSize"
            class="border rounded p-1 w-20"
          />
        </div>
      </div>

      <!-- Ordering -->
      <div class="space-y-2">
        <div class="flex gap-4 items-center">
          <label class="font-medium">Enable Ordering:</label>
          <input
            type="checkbox"
            v-model="testConfig.enableOrdering"
          />
        </div>
        <div
          v-if="testConfig.enableOrdering"
          class="flex gap-4 items-center ml-4"
        >
          <label>Order Column:</label>
          <input
            v-model="testConfig.orderColumn"
            class="border rounded p-1"
          />
          <label>Ascending:</label>
          <input
            type="checkbox"
            v-model="testConfig.orderAscending"
          />
        </div>
      </div>

      <!-- Filters -->
      <div class="space-y-2">
        <div class="flex gap-4 items-center">
          <label class="font-medium">Enable Filters:</label>
          <input
            type="checkbox"
            v-model="testConfig.enableFilters"
          />
        </div>
        <div
          v-if="testConfig.enableFilters"
          class="space-y-2 ml-4"
        >
          <div class="flex gap-4 items-center">
            <label>Filter Column:</label>
            <input
              v-model="testConfig.filterColumn"
              class="border rounded p-1"
            />
          </div>
          <div class="flex gap-4 items-center">
            <label>Filter Value:</label>
            <input
              v-model="testConfig.filterValue"
              class="border rounded p-1"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-4 mb-4">
      <button
        @click="handleRefresh"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        :disabled="isSelecting"
      >
        Refresh Data
      </button>
      <button
        @click="handleLoadMore"
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        :disabled="isSelecting"
      >
        Load More
      </button>
    </div>

    <!-- Loading State -->
    <div
      v-if="isSelecting"
      class="mb-4"
    >
      Loading...
    </div>

    <!-- Results -->
    <div class="space-y-4">
      <h3 class="text-lg font-bold">Results</h3>
      <pre class="bg-gray-100 p-4 rounded overflow-auto max-h-96">{{ items }}</pre>
    </div>

    <!-- Debug Info -->
    <div class="mt-8 space-y-4">
      <h3 class="text-lg font-bold">Current Configuration</h3>
      <pre class="bg-gray-100 p-4 rounded overflow-auto">{{ selectConfig }}</pre>
    </div>
  </div>
</template>
