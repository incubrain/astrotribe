<script setup lang="ts">
const client = useSupabaseClient()
const toast = useNotification()

const contentSources = ref([])
const selectedConfig = ref({})
const selectedSource = ref(null)
const isLoading = ref(false)
const displayContentSourceModal = ref(false)

const fetchContentSources = async () => {
  isLoading.value = true
  const { data, error } = await client.from('content_sources').select(`
              *,             
      scraper_configs:scraper_configs!public_content_sources_link_scraper_id_fkey(*)
            `)

  if (error) {
    console.error('Error fetching content sources:', error)
  } else {
    contentSources.value = data
  }
  isLoading.value = false
}

const selectConfig = (source) => {
  selectedSource.value = source
  console.log('source', source)
  if (source.scraper_configs) {
    const cfg = source.scraper_configs
    selectedConfig.value = {
      id: cfg.id,
      type: cfg.scraper_type,
      base_selector: cfg.base_selector,
      pagination: JSON.stringify(cfg.pagination),
      fields: JSON.stringify(cfg.fields, null, 2)
    }
  } else {
    selectedConfig.value = {}
  }
}

const saveAllConfigs = async () => {
  const updatedFields = JSON.parse(selectedConfig.value.fields)
  const updatedPagination = JSON.parse(selectedConfig.value.pagination)

  const { error } = await client
    .from('scraper_configs')
    .update({
      fields: updatedFields,
      pagination: updatedPagination,
      base_selector: selectedConfig.value.base_selector
    })
    .eq('id', config.id)

  if (error) {
    console.error(`Error saving config for ID ${config.id}:`, error)
    toast.error({ summary: 'Updating Config', message: error.message })
  }
  toast.success({ summary: 'Updating Config', message: 'The config was updated successfully' })
}

onMounted(fetchContentSources)
</script>

<template>
  <div class="p-4">
    <div class="mb-4 flex items-center justify-between">
      <h1 class="text-xl font-bold">Scraper Configuration</h1>
      <div class="flex gap-4">
        <PrimeButton
          label="New Source"
          @click="displayContentSourceModal = true"
        />
        <PrimeButton
          label="Save Configs"
          @click="saveAllConfigs"
        />
        <PrimeButton
          label="Refresh"
          icon="pi pi-refresh"
          class="p-button-secondary"
          @click="fetchContentSources"
          :disabled="isLoading"
        />
      </div>
    </div>
    <div class="flex min-w-[200px] gap-4">
      <div class="border-color rounded-lg border p-4">
        <h4 class="text-lg pb-4 font-semibold text-primary-600">Scrapers</h4>
        <ul class="list-inside text-sm">
          <li
            v-for="source in contentSources"
            :key="source.id"
            class="mb-1 cursor-pointer text-primary-500 hover:underline"
            :class="selectedSource?.name === source.name ? 'rounded-lg bg-primary-950 px-2' : ''"
          >
            <a
              href="#"
              @click.prevent="selectConfig(source)"
            >
              {{ source.name.replaceAll('_', ' ') }}
            </a>
          </li>
        </ul>
      </div>
      <AdminScraperConfig
        :selected-source="selectedSource"
        :selected-config="selectedConfig"
        @update:source="selectedSource = $event"
        @update:configs="selectedConfig = $event"
        @fetchSources="fetchContentSources"
      />
    </div>
    <AdminScraperSourceModal :fetch-content-sources="fetchContentSources" />
  </div>
</template>

<style scoped></style>
