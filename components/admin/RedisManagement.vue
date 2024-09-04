<script lang="ts" setup>
import { FilterMatchMode } from '@primevue/core/api'

const PAGE_SIZE = 50

const scraperUrl = useRuntimeConfig().public.scraperUrl

const tableData = ref([])
const loading = ref(false)
const totalRecords = ref(0)
const filters = ref({
  table: { matchMode: FilterMatchMode.CONTAINS, value: null },
  category: { matchMode: FilterMatchMode.CONTAINS, value: null },
  type: { matchMode: FilterMatchMode.CONTAINS, value: null }
})

const dialogVisible = ref(false)
const dialogMode = ref<'view' | 'edit'>('view')
const dialogHeader = computed(() => (dialogMode.value === 'view' ? 'View Value' : 'Edit Value'))
const selectedValue = ref('')
const editedValue = ref('')
const selectedKey = ref('')

const loadKeys = async (page = 0, pageSize = PAGE_SIZE) => {
  loading.value = true
  try {
    const response = await fetch(
      `${scraperUrl}/admin/redis/keys?page=${page}&pageSize=${pageSize}&includeValues=true`
    )

    const data = await response.json()
    console.log('REDIS DATA', data)
    tableData.value = data.keys.map(parseKey)
    totalRecords.value = data.total
  } catch (error) {
    console.error('Failed to fetch keys', error)
  } finally {
    loading.value = false
  }
}

const parseKey = (item: { key: string; value: string }) => {
  const match = item.key.match(/\{(.+?)\}:(.+?):(.+)/)
  if (match) {
    return {
      key: item.key,
      table: match[1],
      category: match[2],
      type: match[3],
      value: item.value
    }
  }
  return { key: item.key, table: '', category: '', type: '', value: item.value }
}

const onPage = (event: any) => {
  loadKeys(event.page, event.rows)
}

const truncateValue = (value: string) => {
  return value.split(',')
}

const viewFullValue = (data: any) => {
  selectedKey.value = data.key
  selectedValue.value = data.value
  dialogMode.value = 'view'
  dialogVisible.value = true
}

const editValue = (data: any) => {
  selectedKey.value = data.key
  editedValue.value = JSON.stringify(data.value, null, 2)
  dialogMode.value = 'edit'
  dialogVisible.value = true
}

const saveEditedValue = async () => {
  try {
    await fetch(`${scraperUrl}/admin/redis/keys/${encodeURIComponent(selectedKey.value)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: editedValue.value })
    })
    dialogVisible.value = false
    loadKeys() // Refresh the data
  } catch (error) {
    console.error('Failed to update value', error)
  }
}

const deleteKey = async (key: string) => {
  if (confirm('Are you sure you want to delete this key?')) {
    try {
      await fetch(`${scraperUrl}/admin/redis/keys/${encodeURIComponent(key)}`, { method: 'DELETE' })
      loadKeys() // Refresh the data
    } catch (error) {
      console.error('Failed to delete key', error)
    }
  }
}

const flushDatabase = async () => {
  if (confirm('Are you sure you want to flush the entire database?')) {
    try {
      await fetch(`${scraperUrl}/admin/redis/flush`, { method: 'POST' })
      alert('Database flushed successfully')
      loadKeys()
    } catch (error) {
      console.error('Failed to flush database', error)
    }
  }
}

loadKeys()
</script>

<template>
  <div class="p-4">
    <div class="border-color background mb-4 flex items-center gap-4 rounded-md border p-4">
      <h1>Redis Management</h1>
      <PrimeButton @click="loadKeys">Refresh Keys</PrimeButton>
      <PrimeButton
        @click="flushDatabase"
        severity="danger"
        >Flush Database</PrimeButton
      >
    </div>

    <PrimeDataTable
      :value="tableData"
      :paginator="true"
      :rows="PAGE_SIZE"
      v-model:filters="filters"
      filterDisplay="row"
      :globalFilterFields="['table', 'category']"
      :loading="loading"
      @page="onPage"
      :totalRecords="totalRecords"
    >
      <PrimeColumn
        field="table"
        header="Table"
        style="max-width: 8rem"
        :sortable="true"
      >
        <template #filter="{ filterModel }">
          <PrimeInputText
            v-model="filterModel.value"
            placeholder="Search by table"
          />
        </template>
      </PrimeColumn>
      <PrimeColumn
        field="category"
        header="Category"
        :sortable="true"
      >
        <template #filter="{ filterModel }">
          <InputText
            v-model="filterModel.value"
            placeholder="Search by category"
          />
        </template>
      </PrimeColumn>
      <PrimeColumn
        field="type"
        header="Type"
        :sortable="true"
      >
        <template #filter="{ filterModel }">
          <PrimeInputText
            v-model="filterModel.value"
            placeholder="Search by type"
          />
        </template>
      </PrimeColumn>
      <PrimeColumn
        field="value"
        header="Value"
        :sortable="false"
      >
        <template #body="slotProps">
          <div class="flex flex-col text-sm max-w-64 text-wrap overflow-scroll">
            <pre>{{ slotProps.data.value }}</pre>
          </div>
        </template>
      </PrimeColumn>
      <PrimeColumn
        field="edit"
        header="Edit"
      >
        <template #body="slotProps">
          <div class="flex flex-col">
            <div class="mt-2 flex gap-2">
              <PrimeButton
                @click="viewFullValue(slotProps.data)"
                label="View"
                size="small"
              />
              <PrimeButton
                @click="editValue(slotProps.data)"
                label="Edit"
                size="small"
                severity="secondary"
              />
              <PrimeButton
                @click="deleteKey(slotProps.data.key)"
                label="Delete"
                size="small"
                severity="danger"
              />
            </div>
          </div>
        </template>
      </PrimeColumn>
    </PrimeDataTable>

    <PrimeDialog
      v-model:visible="dialogVisible"
      :header="dialogHeader"
      :modal="true"
    >
      <template v-if="dialogMode === 'view'">
        <pre>{{ selectedValue }}</pre>
      </template>
      <template v-else-if="dialogMode === 'edit'">
        <PrimeTextarea
          v-model="editedValue"
          rows="10"
          class="w-full"
        ></PrimeTextarea>
      </template>
      <template
        #footer
        v-if="dialogMode === 'edit'"
      >
        <PrimeButton
          @click="saveEditedValue"
          label="Save"
        />
        <PrimeButton
          @click="dialogVisible = false"
          label="Cancel"
          severity="secondary"
        />
      </template>
    </PrimeDialog>
  </div>
</template>
