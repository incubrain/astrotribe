<script setup lang="ts">
import { useChangeCase } from '@vueuse/integrations/useChangeCase'

const props = defineProps({
  selectedSource: {
    type: Object,
    required: true
  },
  selectedConfig: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:source', 'update:configs', 'fetchSources'])

const client = useSupabaseClient()
const toast = useNotification()

const createConfig = reactive({
  source_id: null,
  html: '',
  contentType: '',
  scraperType: '',
  fields: null,
  base_selector: null,
  pagination: null
})

const scraperTypes = [
  { label: 'Link', value: 'link' },
  { label: 'Doc', value: 'doc' }
]

const contentTypes = [
  { label: 'News', value: 'news' },
  { label: 'Events', value: 'events' },
  { label: 'Jobs', value: 'jobs' },
  { label: 'Research', value: 'research' }
]

const addNewScraper = async () => {
  if (!createConfig.scraperType || !createConfig.fields) {
    toast.warn({ summary: 'Please Provide Information', message: 'Not enough info provided' })
    return
  }

  const { data, error } = await client
    .from('scraper_configs_links')
    .insert({
      scraper_type: createConfig.scraperType,
      base_selector: createConfig.base_selector,
      pagination: createConfig.pagination,
      fields: JSON.parse(createConfig.fields)
    })
    .single()

  if (error) {
    console.error('Error adding new scraper:', error)
    toast.error({
      summary: 'Adding New Content Source',
      message: 'Error adding new content source'
    })
    return
  }

  const { id: scraperConfigId } = data
  await client
    .from('content_source')
    .insert({
      link_scraper_id: scraperConfigId
    })
    .eq('id', props.selectedSource.id)

  toast.success({ summary: 'Added New Content Source', message: 'Added new Source' })
  createConfig.fields = null
  emit('update:source')
}

const extractDataFromHtml = async (input: CreateConfig) => {
  try {
    const response = await client.functions.invoke('create-scraper', {
      method: 'POST',
      body: {
        htmlContent: input.html.trim(),
        contentType: `${input.contentType.toLowerCase()}_${input.scraperType.toLowerCase()}`
      }
    })

    if (response.error) {
      throw response.error
    }

    createConfig.fields = JSON.parse(response.data.config)
  } catch (error) {
    console.error('Error extracting data from HTML:', error)
    createConfig.fields = null
  }
}
</script>

<template>
  <div class="flex flex-grow flex-col gap-4 xl:flex-row">
    <!-- CREATE CONFIG -->
    <div class="mb-4">
      <h4 class="text-lg pb-4 font-semibold text-primary-600">Create Config</h4>
      <div class="mb-4">
        <label
          for="html-content"
          class="text-900 mb-2 block font-medium"
          >HTML Content</label
        >
        <PrimeTextarea
          v-model="createConfig.html"
          cols="80"
          rows="24"
          class="border-color max-h-[460px] w-full overflow-scroll rounded border p-2"
        />
      </div>
      <div class="space-y-4">
        <div>
          <label
            for="content-type"
            class="text-900 mb-2 block font-medium"
          >
            Content Type
          </label>
          <PrimeSelect
            v-model="createConfig.contentType"
            :options="contentTypes"
            optionLabel="label"
            optionValue="value"
            placeholder="Select a content type"
            id="content-type"
            class="w-full"
          />
        </div>
        <div>
          <label
            for="scraper-type"
            class="text-900 mb-2 block font-medium"
            >Scraper Type</label
          >
          <PrimeSelect
            v-model="createConfig.scraperType"
            :options="scraperTypes"
            optionLabel="label"
            optionValue="value"
            placeholder="Select a scraper type"
            id="scraper-type"
            class="w-full"
          />
        </div>
      </div>
      <div class="mt-4 flex justify-end gap-4">
        <PrimeButton
          label="Create Config"
          class="p-button-primary"
          @click="extractDataFromHtml(createConfig)"
        />
      </div>
      <div
        v-if="createConfig.fields"
        class="mt-4"
      >
        <h4 class="text-lg pb-4 font-semibold text-primary-600">Extracted Config</h4>
        <pre class="border-color border p-2">{{ createConfig.fields }}</pre>
      </div>
      <div>
        <PrimeTextarea
          v-model="createConfig.fields"
          rows="10"
          cols="80"
          autoResize
          class="border-color mt-4 w-full rounded border p-2"
        />
        <div class="mt-4 flex justify-end gap-4">
          <PrimeButton
            label="Add New Scraper"
            @click="addNewScraper"
          />
        </div>
      </div>
    </div>
    <!-- CURRENT CONFIGS -->
    <div
      v-if="selectedConfig.type"
      class="flex-grow"
    >
      <h4 class="text-lg pb-4 font-semibold text-primary-600">Active Configs </h4>
      <div class="mb-4">
        <label
          for="scraper-type"
          class="text-900 mb-2 block font-medium"
        >
          {{ useChangeCase(selectedConfig.type, 'capitalCase').value }} Config
        </label>

        <label class="text-900 mb-2 block font-medium"> Base Selector </label>
        <PrimeInputText
          v-model="selectedConfig.base_selector"
          class="border-color h-full max-h-[460px] w-full rounded border p-2"
        />

        <div class="space-y-2">
          <label class="text-900 block font-medium"> Fields </label>
          <PrimeMessage severity="info">
            Only extract url/title/published_at properties
          </PrimeMessage>
          <PrimeTextarea
            v-model="selectedConfig.fields"
            cols="60"
            rows="24"
            class="border-color h-full max-h-[460px] w-full rounded border p-2"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
