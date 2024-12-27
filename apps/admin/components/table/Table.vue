<!-- components/table/Table.vue -->
<template>
  <div class="foreground rounded-lg">
    <TableHeader
      :table-name="tableName"
      :selected-count="selectedRows.length"
      :total-count="data.length"
      @add-row="openNewRowDialog"
      @delete-selected="confirmDelete"
    />

    <TableSearch
      v-model:filters="filters"
      :loading="loading"
      @refresh="loadData"
    />

    <TableDataGrid
      v-model:selection="selectedRows"
      :data="data"
      :columns="columns"
      :loading="loading"
      :filters="filters"
    />

    <TableDialogDeleteRow
      v-model:visible="deleteDialogVisible"
      :count="selectedRows.length"
      @confirm="handleBulkDelete"
    />

    <TableDialogAddRow
      v-model:visible="newRowDialogVisible"
      :columns="columns"
      :table-name="tableName"
      @row-added="onRowAdded"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTableData } from '~/composables/useTableData'
import { useTableOperations } from '~/composables/useTableOperations'

const props = defineProps<{
  tableName: string
}>()

// Split data management logic
const { data, columns, loading, loadData } = useTableData(props.tableName)

// Split operations logic
const {
  selectedRows,
  deleteDialogVisible,
  newRowDialogVisible,
  handleBulkDelete,
  onRowAdded,
  confirmDelete,
  openNewRowDialog,
} = useTableOperations(data)

// Search state
const filters = ref({
  global: { value: null, matchMode: 'contains' },
})

onMounted(() => {
  loadData()
})
</script>
