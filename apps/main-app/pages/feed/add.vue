<script setup lang="ts">
import { handleResponse } from '@ib/logger'

const logger = useLogger()
// Fetch categories
const { store: categoriesStore } = useSelectData('categories', {
  columns: 'id, name',
  orderBy: { column: 'name', ascending: true },
  initialFetch: true,
})

// Fetch content sources directly (not through contents anymore)
const { store: sourcesStore } = useSelectData('content_sources', {
  columns: `
    id,
    url,
    companies (
      id,
      name,
      logo_url,
      category,
      description
    )
  `,
  orderBy: { column: 'created_at', ascending: true },
  initialFetch: true,
})

// Toggle source selection - using the content_source id directly now
const toggleSource = (sourceId: number) => {
  // Now it's definitely a number/bigint
  if (selectedSourceIds.value.has(sourceId)) {
    selectedSourceIds.value.delete(sourceId)
  } else {
    selectedSourceIds.value.add(sourceId)
  }
}

const name = ref('')
const selectedCategories = ref([])
const selectedSourceIds = ref(new Set())
const categorySearch = ref('')
const sourceSearch = ref('')

const { items: categories } = storeToRefs(categoriesStore)
const { items: sources } = storeToRefs(sourcesStore)

// Computed property for filtered sources based on search
const filteredSources = computed(() => {
  if (!sourceSearch.value) return sources.value

  const search = sourceSearch.value.toLowerCase()
  return sources.value.filter(
    (source) =>
      source.title?.toLowerCase().includes(search) ||
      source.companies?.name?.toLowerCase().includes(search),
  )
})

const save = async () => {
  const toast = useNotification()

  const feed = {
    name: name.value,
    selectedCategories: selectedCategories.value,
    selectedSourceIds: selectedSourceIds.value,
  }

  try {
    const data = await handleResponse(
      logger,
      () =>
        $fetch('/api/feeds', {
          method: 'POST',
          body: feed,
        }),
      'Failed to create feed',
    )

    toast.success({ summary: 'Feed added', message: `${feed.name} was created successfully` })
    navigateTo('/')
  } catch (error: any) {
    toast.error({ summary: 'Error creating feed', message: error.message })
  }
}

const reset = () => {
  name.value = ''
  selectedCategories.value = []
  selectedSourceIds.value = new Set()
  categorySearch.value = ''
  sourceSearch.value = ''
}
</script>

<template>
  <div class="max-w-6xl mx-auto p-4">
    <div class="mb-6">
      <h1 class="text-2xl font-semibold mb-2">Create New Feed</h1>
      <p class="text-gray-500">Select categories and sources for your personalized feed</p>
    </div>

    <div class="space-y-6">
      <!-- Feed Name -->
      <PrimeCard>
        <template #title>Feed Details</template>
        <template #content>
          <PrimeInputText
            v-model="name"
            placeholder="Enter feed name"
            class="w-full mb-4"
          />
        </template>
      </PrimeCard>

      <!-- Categories Selection -->
      <PrimeCard>
        <template #title>Categories</template>
        <template #subtitle>Select topics you're interested in</template>
        <template #content>
          <PrimeMultiSelect
            v-model="selectedCategories"
            :options="categories"
            option-label="name"
            :filter="true"
            placeholder="Search and select categories"
            class="w-full"
            display="chip"
          >
            <template #header>
              <div class="font-medium px-3 py-2">
                Available Categories
                <span
                  v-if="selectedCategories.length"
                  class="text-sm text-primary-500 ml-2"
                >
                  ({{ selectedCategories.length }} selected)
                </span>
              </div>
            </template>

            <template #option="{ option }">
              <div class="flex items-center px-3 py-2">
                <div>{{ option.name }}</div>
              </div>
            </template>

            <template #footer>
              <div class="p-3 flex justify-between">
                <PrimeButton
                  label="Select All"
                  severity="secondary"
                  text
                  size="small"
                  icon="pi pi-check-circle"
                  @click="selectedCategories = [...categories]"
                />
                <PrimeButton
                  label="Clear All"
                  severity="danger"
                  text
                  size="small"
                  icon="pi pi-times"
                  @click="selectedCategories = []"
                />
              </div>
            </template>
          </PrimeMultiSelect>
        </template>
      </PrimeCard>

      <!-- Sources Selection -->
      <PrimeCard class="max-h-[540px] overflow-scroll">
        <template #title>Sources</template>
        <template #subtitle>Follow specific news sources</template>
        <template #content>
          <!-- Search input -->
          <div class="mb-4 sticky top-0">
            <PrimeInputText
              v-model="sourceSearch"
              placeholder="Search sources"
              class="w-full"
            />
          </div>

          <!-- Source cards grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <button
              v-for="source in filteredSources"
              :key="source.id"
              class="flex items-center p-4 rounded-lg border border-gray-800 transition-colors text-left"
              :class="{
                'bg-primary-900 border-primary-700': selectedSourceIds.has(source.id),
                'hover:border-primary-700': !selectedSourceIds.has(source.id),
              }"
              @click="toggleSource(source.id)"
            >
              <div class="flex items-center gap-3 w-full">
                <div class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    :src="
                      source.companies?.logo_url ||
                      `/api/placeholder/40/40?text=${source.companies?.name?.[0] || 'S'}`
                    "
                    :alt="source.companies?.name"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="flex-grow min-w-0">
                  <div class="font-medium truncate">{{ source.companies?.name }}</div>
                  <div class="text-sm text-gray-400 truncate">{{ source.url }}</div>
                </div>
                <Icon
                  v-if="selectedSourceIds.has(source.id)"
                  name="mdi:check-circle"
                  class="text-primary-500 flex-shrink-0"
                  size="20"
                />
              </div>
            </button>
          </div>
        </template>
      </PrimeCard>

      <!-- Actions -->
      <div class="flex justify-end gap-4">
        <PrimeButton
          label="Reset"
          severity="secondary"
          outlined
          @click="reset"
        />
        <PrimeButton
          label="Create Feed"
          :disabled="!name || (!selectedCategories.length && !selectedSourceIds.size)"
          @click="save"
        />
      </div>
    </div>
  </div>
</template>
