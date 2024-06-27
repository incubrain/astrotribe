<script setup lang="ts">
const props = defineProps({
  fetchContentSources: {
    type: Function,
    required: true
  }
})

const client = useSupabaseClient()
const toast = useNotification()

const displayContentSourceModal = ref(false)
const newContentSource = ref({
  name: '',
  description: '',
  url: '',
  paginated_url: '',
  scrape_frequency: 'daily',
  content_type: 'news'
})

const scrapeFrequencies = [
  { label: 'Four Times Daily', value: 'four_times_daily' },
  { label: 'Twice Daily', value: 'twice_daily' },
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Bi-Weekly', value: 'bi_weekly' },
  { label: 'Monthly', value: 'monthly' }
]

const contentTypes = [
  { label: 'News', value: 'news' },
  { label: 'Events', value: 'events' },
  { label: 'Jobs', value: 'jobs' },
  { label: 'Research', value: 'research' }
]

const addNewContentSource = async () => {
  const { data, error } = await client
    .from('content_sources')
    .insert(newContentSource.value)
    .single()

  if (error) {
    console.error('Error adding new content source:', error)
    alert(`Error adding new content source: ${error.message}`)
    return
  }

  toast.success({ message: 'New Source Added', summary: 'Success' })
  displayContentSourceModal.value = false
  newContentSource.value = {
    name: '',
    description: '',
    url: '',
    paginated_url: '',
    scrape_frequency: 'daily',
    content_type: 'news'
  }
  // dispatch event?
  props.fetchContentSources()
}
</script>
<template>
  <PrimeDialog
    header="Add New Content Source"
    :visible.sync="displayContentSourceModal"
    modal
    class="p-fluid"
  >
    <div class="mb-4">
      <label
        for="content-source-name"
        class="text-900 mb-2 block font-medium"
        >Name</label
      >
      <PrimeInputText
        v-model="newContentSource.name"
        id="content-source-name"
        class="w-full"
      />
    </div>
    <div class="mb-4">
      <label
        for="content-source-description"
        class="text-900 mb-2 block font-medium"
        >Description</label
      >
      <PrimeInputText
        v-model="newContentSource.description"
        id="content-source-description"
        class="w-full"
      />
    </div>
    <div class="mb-4">
      <label
        for="content-source-url"
        class="text-900 mb-2 block font-medium"
      >
        URL
      </label>
      <PrimeInputText
        v-model="newContentSource.url"
        id="content-source-url"
        class="w-full"
      />
    </div>
    <div class="mb-4">
      <label
        for="content-source-url"
        class="text-900 mb-2 block font-medium"
      >
        Paginated URL
      </label>
      <PrimeInputText
        v-model="newContentSource.paginated_url"
        id="content-source-paginated_url"
        class="w-full"
      />
    </div>
    <div class="mb-4">
      <label
        for="content-source-frequency"
        class="text-900 mb-2 block font-medium"
        >Scrape Frequency</label
      >
      <PrimeDropdown
        v-model="newContentSource.scrape_frequency"
        :options="scrapeFrequencies"
        optionLabel="label"
        optionValue="value"
        placeholder="Select a frequency"
        id="content-source-frequency"
        class="w-full"
      />
    </div>
    <div class="mb-4">
      <label
        for="content-source-type"
        class="text-900 mb-2 block font-medium"
        >Content Type</label
      >
      <PrimeDropdown
        v-model="newContentSource.content_type"
        :options="contentTypes"
        optionLabel="label"
        optionValue="value"
        placeholder="Select a content type"
        id="content-source-type"
        class="w-full"
      />
    </div>
    <div class="mt-4 flex justify-end gap-4">
      <PrimeButton
        label="Cancel"
        class="p-button-secondary"
        @click="displayContentSourceModal = false"
      />
      <PrimeButton
        label="Add"
        class="p-button-primary"
        @click="addNewContentSource"
      />
    </div>
  </PrimeDialog>
</template>

<style scoped></style>
