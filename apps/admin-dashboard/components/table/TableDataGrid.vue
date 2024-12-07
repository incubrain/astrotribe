<!-- components/admin/table/DataGrid.vue -->
<template>
  <div class="w-full">
    <PrimeDataTable
      v-model:selection="selection"
      :value="data"
      :loading="loading"
      removable-sort
      :paginator="true"
      :rows="100"
      :filters="filters"
      filter-display="menu"
      responsive-layout="scroll"
      :scrollable="true"
      scroll-height="flex"
      :pt="tablePassThroughOptions"
    >
      <PrimeColumn
        selection-mode="multiple"
        header-style="width: 4rem"
        :frozen="true"
        :style="{ width: '4rem', minWidth: '4rem' }"
        :pt="selectionColumnPt"
      />

      <PrimeColumn
        v-for="col in columns"
        :key="col.field"
        :field="col.field"
        :field-name="col.field"
        :header="col.column_name"
        :sortable="true"
        :pt="columnPt"
        style="max-width: 250px; min-width: 150px"
      >
        <template #body="slotProps">
          <div class="truncate hover:text-clip hover:overflow-visible">
            {{ slotProps.data[slotProps.field] }}
          </div>
        </template>
      </PrimeColumn>

      <template #empty>
        <div class="text-center py-6">
          <p class="text-sm text-muted-foreground">No records found</p>
        </div>
      </template>

      <template #loading>
        <div class="text-center py-6">
          <p class="text-sm text-muted-foreground">Loading data...</p>
        </div>
      </template>
    </PrimeDataTable>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: any[]
  columns: any[]
  loading: boolean
  filters: any
  selection: any[]
}>()

const emit = defineEmits<{
  'update:selection': [value: any[]]
}>()

const selection = computed({
  get: () => props.selection,
  set: (value) => emit('update:selection', value),
})

const { tablePassThroughOptions, selectionColumnPt, columnPt } = useDataGridStyles()
</script>

<style scoped>
.p-datatable-wrapper {
  overflow-x: auto !important;
}

/* Remove row hover selection styling */
.p-datatable .p-datatable-tbody > tr:hover {
  background: transparent !important;
  cursor: default !important;
}

/* Remove selectable cursor */
.p-datatable .p-datatable-tbody > tr {
  cursor: default !important;
}

/* Make sure checkbox still shows pointer */
.p-checkbox {
  cursor: pointer !important;
}
</style>
