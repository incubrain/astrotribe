<script setup lang="ts">
import type { DataTableFilterMeta } from 'primevue/datatable'

interface Column {
  field: string
  header: string
  style: string
}

type FilterFields = (string | ((data: any) => string))[] | undefined

const props = defineProps({
  columns: {
    type: Array as PropType<Column[]>,
    required: true,
  },
  tableData: {
    type: Array,
    required: true,
  },
  filters: {
    type: Object as PropType<DataTableFilterMeta>,
    required: true,
  },
  filterFields: {
    type: Array as PropType<FilterFields>,
    required: true,
  },
})

const dataRows = computed(() => props.tableData)
const tableFilters = ref({ ...props.filters })
const selectedRows = ref([])
</script>

<template>
  <PrimeDataTable
    v-if="columns.length > 0 && dataRows.length > 0"
    v-model:selection="selectedRows"
    v-model:filters="tableFilters"
    :value="dataRows"
    striped-rows
    size="small"
    :global-filter-fields="filterFields"
    paginator
    :rows="100"
    paginator-template="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
    :rows-per-page-options="[20, 50, 100]"
    current-page-report-template="{first} to {last} of {totalRecords}"
    scrollable
    scroll-height="flex"
    state-storage="session"
    state-key="admin-user-profiles-table"
    data-key="id"
    :pt="{
      column: {
        bodycell: ({ state }) => ({
          style: state['d_editing'] && 'padding-top: 0.6rem; padding-bottom: 0.6rem text-nowrap',
        }),
      },
      paginator: { paginatorwrapper: 'border-color', root: 'rounded-none' },
    }"
  >
    <template #header>
      <div class="flex items-center justify-start gap-4">
        <PrimeInputText
          v-model="filters['global'].value"
          placeholder="Search"
          size="small"
          class="flex items-center justify-center rounded-lg"
        />
        <slot name="header" />
      </div>
    </template>

    <template #empty> No data found. </template>

    <template #loading> Loading data. Please wait. </template>

    <PrimeColumn
      selection-mode="multiple"
      header-style="width: 3rem"
    ></PrimeColumn>

    <PrimeColumn
      :frozen="true"
      body-style="text-align:center text:nowrap"
      :pt="{
        headercell: 'text-nowrap text-sm p-3 bg-primary-950 text-center w-full',
        bodycell: 'text-nowrap overflow-scroll',
      }"
    ></PrimeColumn>

    <PrimeColumn
      v-for="col in columns"
      :key="col.field"
      :field="col.field"
      :header="col.header"
      :style="col.style"
      :pt="{
        headercell: 'text-nowrap text-sm p-3 bg-primary-950',
        headerTitle: 'text-center w-full',
        bodycell: 'text-nowrap overflow-scroll max-w-sm text-sm foreground min-w-24 text-center',
      }"
    >
      <template #body="{ data, field }">
        <component
          :is="col.component"
          v-model="data[field]"
          class="w-full text-sm"
          v-bind="col.componentProps"
        />
      </template>
      <template #filter="{ filterCallback }">
        <PrimeInputText
          type="text"
          class="h-6 w-full"
          placeholder="Search by name"
          @input="filterCallback()"
        />
      </template>
    </PrimeColumn>

    <template #paginatorstart>
      <PrimeButton
        type="button"
        icon="pi pi-download"
        label="refresh"
        text
      />
    </template>
    <template #paginatorend>
      <PrimeButton
        type="button"
        icon="pi pi-download"
        label="download"
        text
      />
    </template>
  </PrimeDataTable>
</template>

<style scoped>
.p-datatable-wrapper {
  background-color: red !important;
}
</style>
