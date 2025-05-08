<script setup lang="ts">
definePageMeta({
  layoutTransition: false,
  name: 'Classifier',
})

const contentTypes = [
  { label: 'News', value: 'news' },
  { label: 'Events', value: 'events' },
  { label: 'Opportunities', value: 'opportunities' },
  { label: 'Research', value: 'research' },
  { label: 'Companies', value: 'companies' },
  { label: 'Unknown', value: 'unknown' },
]

const notification = useNotification()
const selectedUrls = ref([])

const {
  store: urlStore,
  loadMore,
  refresh,
  isSelecting,
} = useSelectData('classified_urls', {
  initialFetch: true,
  columns: '*',
  orderBy: { column: 'created_at', ascending: false },
  pagination: { page: 1, limit: 99 },
})

// Updating data
const { updateData, isUpdating } = useUpdateData('classified_urls')

// Function to update actual category
const updateActualCategory = async (id: number, category: string) => {
  notification.info({
    summary: 'Updating category',
    message: 'Category update in progress. Click to cancel.',
  })

  const timeoutId = setTimeout(async () => {
    try {
      await updateData(id, { id, actual_category: category, is_reviewed: true })
      notification.success({
        summary: 'Category updated',
        message: 'The category has been successfully updated.',
      })
    } catch (error: any) {
      notification.error({
        summary: 'Update failed',
        message: 'Failed to update the category. Please try again.',
      })
    }
  }, 3000)

  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      notification.info({
        summary: 'Update cancelled',
        message: 'The category update has been cancelled.',
      })
    }
  }
}

const markAsReviewed = async () => {
  const ids = selectedUrls.value.map((row) => row.id)
  for (const id of ids) {
    await updateData(id, { is_reviewed: true })
  }
  // Refresh data after updating
  await refresh()
}

// Delete URLs
const deleteUrls = async () => {
  const ids = selectedUrls.value.map((row) => row.id)
  try {
    await $fetch('/api/classifier/delete', {
      body: { ids },
    })
    // Refresh data after operation
    await refresh()
  } catch (error: any) {
    console.error('Error deleting URLs:', error)
  }
}

const addToTrainingData = async (rows) => {
  const ids = rows.map((row) => row.id)
  console.log('Adding to training data:', ids)

  try {
    await $fetch('/api/classifier/insert', {
      body: { ids },
    })
    // Optionally refresh data after operation
    await refresh()
  } catch (error: any) {
    console.error('Error adding to training data:', error)
  }
}

const fetchedUrls = ref([])
const uniqueLabels = ref(new Set())
const labelSeverities = ref({})

onMounted(async () => {
  await selectUrls()
  processUrls()
})

const selectUrls = async () => {
  try {
    const data = await $fetch('/api/classifier/select', {
      method: 'POST',
    })
    fetchedUrls.value = data.data // Assuming the response structure matches
    console.log('Training Urls', fetchedUrls.value)
  } catch (error: any) {
    console.error('Error fetching URLs:', error)
  }
}

const severities = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'contrast']

const labelCounts = computed(() => {
  const counts = {}
  fetchedUrls.value?.forEach((url) => {
    counts[url.label] = (counts[url.label] || 0) + 1
  })
  return counts
})

const totalUrls = computed(() => fetchedUrls.value.length)

const processUrls = () => {
  uniqueLabels.value = new Set(fetchedUrls.value?.map((item) => item.label))

  Array.from(uniqueLabels.value).forEach((label, index) => {
    labelSeverities.value[label] = severities[index % severities.length]
  })
}

const getLabelSeverity = (label) => {
  return labelSeverities.value[label] || 'info'
}
</script>

<template>
  <div class="flex h-full flex-col">
    <PrimeSplitter class="h-full border-color">
      <PrimeSplitterPanel
        class="h-full overflow-scroll p-4"
        :size="25"
      >
        <div class="flex h-full flex-col">
          <h2 class="mb-4 text-2xl font-bold"> Training URLs </h2>

          <!-- Label Summary Metrics -->
          <div class="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-2">
            <PrimeCard
              v-for="(count, label) in labelCounts"
              :key="label"
              class="border-color rounded-md border text-center"
            >
              <template #title>
                <PrimeTag
                  :value="label"
                  :severity="getLabelSeverity(label)"
                />
              </template>
              <template #content>
                <div class="text-2xl font-bold">
                  {{ count }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ ((count / totalUrls) * 100).toFixed(1) }}%
                </div>
              </template>
            </PrimeCard>
          </div>

          <PrimeDataTable
            :value="fetchedUrls"
            size="small"
            class="text-sm"
            :pt="{
              header: ({ props }) => ({
                cell: '!bg-transparent',
              }),
              thead: ({ context }) => ({
                class: '!bg-transparent',
              }),
              tbody: ({ instance, context }) => ({
                class: '!bg-transparent',
              }),
            }"
            :pt-options="{ mergeSections: true, mergeProps: true }"
          >
            <PrimeColumn
              field="url"
              header="URL"
            >
              <template #body="slotProps">
                <a
                  :href="slotProps.data.url"
                  target="_blank"
                >
                  {{ slotProps.data.url }}
                </a>
              </template>
            </PrimeColumn>
            <PrimeColumn
              field="label"
              header="Label"
            >
              <template #body="slotProps">
                <PrimeTag
                  :value="slotProps.data.label"
                  :severity="getLabelSeverity(slotProps.data.label)"
                />
              </template>
            </PrimeColumn>
          </PrimeDataTable>
        </div>
      </PrimeSplitterPanel>
      <PrimeSplitterPanel
        class="h-full w-full overflow-scroll p-4"
        :size="75"
      >
        <PrimeToolbar class="mb-8 w-full">
          <template #start>
            <div class="flex gap-2">
              <PrimeButton
                :disabled="!selectedUrls.length"
                label="Add"
                @click="addToTrainingData"
              >
                <template #icon>
                  <Icon name="mdi:plus" />
                </template>
              </PrimeButton>

              <PrimeButton
                :disabled="!selectedUrls.length"
                label="Reviewed"
                @click="markAsReviewed"
              >
                <template #icon>
                  <Icon name="mdi:check" />
                </template>
              </PrimeButton>

              <PrimeButton
                :disabled="!selectedUrls.length"
                label="Delete"
                severity="danger"
                @click="deleteUrls"
              >
                <template #icon>
                  <Icon name="mdi:delete" />
                </template>
              </PrimeButton>
            </div>
          </template>
          <template #end> </template>
        </PrimeToolbar>

        <PrimeDataTable
          v-model:selection="selectedUrls"
          :value="urlStore.items"
          selection-mode="multiple"
          data-key="id"
          size="small"
          show-gridlines
          :pt="{
            root: 'text-sm',
            thead: { class: 'bg-primary-900' },
            bodycell: { class: 'p-2 border-b' },
          }"
          :pt-options="{ mergeSections: true, mergeProps: true }"
        >
          <PrimeColumn
            selection-mode="multiple"
            style="width: 2em"
          ></PrimeColumn>
          <PrimeColumn
            field="url"
            header="URL"
            body="urlTemplate"
          ></PrimeColumn>
          <PrimeColumn
            field="predicted_category"
            header="Predicted Category"
          ></PrimeColumn>
          <PrimeColumn
            field="actual_category"
            header="Actual Category"
            style="width: 10em"
          >
            <template #body="slotProps">
              <PrimeSelect
                v-model="slotProps.data.actual_category"
                class="relative z-50 w-full"
                :options="contentTypes"
                option-label="label"
                option-value="value"
                placeholder="Select a category"
                @change="updateActualCategory(slotProps.data.id, $event.value)"
              />
            </template>
          </PrimeColumn>
          <PrimeColumn
            field="is_reviewed"
            header="Reviewed"
            body="reviewedTemplate"
          ></PrimeColumn>
          <PrimeColumn body="actionTemplate"></PrimeColumn>
        </PrimeDataTable>
      </PrimeSplitterPanel>
    </PrimeSplitter>
  </div>
</template>

<style scoped></style>
