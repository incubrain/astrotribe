<!-- pages/admin/tables/index.vue -->
<template>
  <div class="text-center py-12">
    <header class="background shadow-sm">
      <div class="mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 justify-between items-center">
          <h1 class="text-2xl font-semibold">Admin Dashboard</h1>
          <div class="flex items-center gap-4">
            <PrimeSelect
              v-model="selectedTable"
              :options="tableOptions"
              option-label="label"
              placeholder="Select Table"
              class="w-64"
            />
            <PrimeButton
              icon="pi pi-refresh"
              @click="refreshData"
              :loading="loading"
            />
          </div>
        </div>
      </div>
    </header>
    <h2 class="text-2xl font-semibold text-gray-700">
      Select a table to manage from the dropdown above
    </h2>
    <p class="mt-2 text-gray-500">
      or refresh the table list if you don't see the table you're looking for
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from '#app'

const router = useRouter()
const adminStore = useAdminTablesStore()
const { loading, tableOptions } = storeToRefs(adminStore)
const selectedTable = ref({ table: '', value: 'select table' })

// Watch for table selection changes
watch(selectedTable, (newTable) => {
  if (newTable) {
    navigateTo(`edit/${newTable.label}`)
  }
})

// Initialize tables
onMounted(async () => {
  await adminStore.fetchTables()
})

const refreshData = async () => {
  await adminStore.fetchTables()
}
</script>
