<script setup lang="ts">
import Fuse from 'fuse.js'

const { addFeed } = usePages()

const { store, loadMore, refresh, isSelecting } = useSelectData('categories', {
  columns: 'id, name',
  orderBy: { column: 'name', ascending: true },
  limit: 100,
  initialFetch: true,
})

const name = ref('')
const search = ref('')
const fuseInstance = ref<Fuse<any> | null>(null)

const { items: proxyCategories } = storeToRefs(store)

const initializeSelection = () => {
  proxyCategories.value = proxyCategories.value.map((item) => ({
    ...item,
    selected: false,
  }))
}

watchEffect(() => {
  if (proxyCategories.value.length > 0) {
    initializeSelection()
    fuseInstance.value = new Fuse(proxyCategories.value, {
      keys: ['name'],
      threshold: 0.3,
      distance: 100,
      ignoreLocation: true,
      shouldSort: true,
    })
  }
})

const toggleSelect = (id: string) => {
  const category = proxyCategories.value.find((item) => item.id === id)
  if (category) {
    category.selected = !category.selected
  }
}

const onSearch = () => {
  if (!search.value || search.value.trim().length < 2) {
    return proxyCategories.value
  }

  if (fuseInstance.value) {
    const results = fuseInstance.value.search(search.value.trim())
    return results.map((result) => ({
      ...result.item,
      selected: proxyCategories.value.find((cat) => cat.id === result.item.id)?.selected || false,
    }))
  }

  return proxyCategories.value
}

const categories = computed(() => onSearch())

const selectedCategories = computed(() => proxyCategories.value.filter((cat) => cat.selected))

const save = async () => {
  const toast = useNotification()
  const selected = selectedCategories.value

  if (!name.value) {
    toast.error({ summary: 'Feed name cannot be empty', message: 'Please enter a feed name' })
    return
  }

  if (!selected.length) {
    toast.error({ summary: 'No categories selected', message: 'Please select some categories' })
    return
  }

  const { profile } = useCurrentUser()
  const client = useSupabaseClient()

  if (profile?.id) {
    const user_id = profile.id
    const feed = { user_id, name: name.value }
    try {
      const { data, error, status } = await client.from('feeds').insert(feed).select('id')

      if (!error) {
        const feed_id = data[0].id
        const res = await Promise.all(
          selected.map((category) =>
            client.from('feed_categories').insert({ feed_id, category_id: category.id }),
          ),
        )

        if (res.every(({ error }) => !error)) {
          toast.success({
            summary: 'Feed created successfully',
            message: `${name.value} was created successfully`,
          })
          addFeed(data[0].id, name.value)
        } else {
          res.forEach(
            ({ error }) =>
              error && toast.error({ summary: 'Could not create feed', message: error.message }),
          )
        }
      } else {
        toast.error({ summary: 'Could not create feed', message: error.message })
      }
    } catch (error) {
      toast.error({ summary: 'Could not create feed', message: error })
    }
  } else {
    toast.error({ summary: 'User Not Authenticated', message: 'Please login again' })
  }
}

const discard = () => {
  name.value = ''
  search.value = ''
  proxyCategories.value.forEach((item) => (item.selected = false))
}

const removeSelected = (id: string) => {
  const category = proxyCategories.value.find((item) => item.id === id)
  if (category) {
    category.selected = false
  }
}

const selectedItems = computed({
  get: () => selectedCategories.value,
  set: () => {}, // We handle removal through the removeSelected method
})

definePageMeta({
  name: 'Add Feed',
})
</script>

<template>
  <div class="mx-auto p-4">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-semibold mb-2">Create New Feed</h1>
      <p class="text-gray-500">Select categories to include in your feed</p>
    </div>

    <!-- Main Layout -->
    <div class="grid grid-cols-1 gap-6">
      <!-- Top Panel - Input and Selected Categories -->
      <PrimeCard class="bg-gray-900">
        <template #content>
          <div class="grid grid-cols-12 gap-4">
            <!-- Feed Name Input -->
            <div class="col-span-12 md:col-span-4">
              <PrimeFloatLabel>
                <PrimeInputText
                  id="feedname"
                  v-model="name"
                  class="w-full"
                  required
                />
                <label for="feedname">Enter feed name</label>
              </PrimeFloatLabel>
            </div>

            <!-- Action Buttons -->
            <div class="col-span-12 md:col-span-8 flex items-center gap-2 justify-end">
              <PrimeSelect
                v-model="selectedItems"
                :options="selectedCategories"
                placeholder="No categories selected"
                option-label="name"
                :close-on-select="false"
                multiple
                class="w-full"
              >
                <template #header>
                  <div class="px-4 py-2 text-gray-400 text-sm font-medium">
                    Selected Categories
                  </div>
                </template>
                <template #value="{ value }">
                  <div class="flex items-center gap-2">
                    <span class="text-gray-300">{{
                      value?.length
                        ? `${value.length} categories selected`
                        : 'No categories selected'
                    }}</span>
                    <PrimeBadge
                      v-if="value?.length"
                      :value="value.length"
                      severity="info"
                    />
                  </div>
                </template>
                <template #option="{ option }">
                  <div class="flex items-center justify-between w-full px-2 py-1">
                    <span>{{ option.name }}</span>
                    <button
                      class="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-700/50"
                      @click.stop="removeSelected(option.id)"
                    >
                      <Icon
                        name="mdi:close"
                        size="16px"
                      />
                    </button>
                  </div>
                </template>
              </PrimeSelect>
              <PrimeButton
                label="Save"
                :disabled="!name || !selectedCategories.length"
                class="flex shrink-0"
                @click="save"
              />
              <button
                class="p-2 hover:bg-gray-800 rounded-full transition-colors"
                @click="discard"
              >
                <Icon
                  name="mdi:trash-can-outline"
                  size="22px"
                  class="text-red-500"
                />
              </button>
            </div>
            <!-- Search -->
            <div class="col-span-12">
              <PrimeFloatLabel>
                <PrimeInputText
                  id="search"
                  v-model="search"
                  class="w-full"
                />
                <label for="search">Search categories</label>
              </PrimeFloatLabel>
            </div>
          </div>
        </template>
      </PrimeCard>

      <!-- Search and Categories -->
      <PrimeCard class="bg-gray-900">
        <template #content>
          <!-- Categories Grid -->
          <PrimeProgressSpinner
            v-if="proxyCategories.length === 0"
            class="w-8 h-8 mx-auto"
          />
          <div
            v-else
            class="h-[500px] overflow-y-auto custom-scrollbar"
          >
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              <PrimeButton
                v-for="category in categories"
                :key="category.id"
                :label="category.name"
                :outlined="!category.selected"
                size="small"
                class="whitespace-normal h-auto py-2 justify-start"
                @click="toggleSelect(category.id)"
              />
            </div>
          </div>
        </template>
      </PrimeCard>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-card) {
  background: transparent;
}

:deep(.p-button) {
  justify-content: flex-start;
}

:deep(.p-inputtext) {
  width: 100%;
  background: theme('colors.gray.800');
}

:deep(.p-dropdown),
:deep(.p-multiselect) {
  background: theme('colors.gray.800');
  border-color: theme('colors.gray.700');
}

:deep(.p-dropdown-panel),
:deep(.p-multiselect-panel) {
  background: theme('colors.gray.800');
  border-color: theme('colors.gray.700');
}

:deep(.p-dropdown-item),
:deep(.p-multiselect-item) {
  color: theme('colors.gray.300');
}

:deep(.p-dropdown-item:hover),
:deep(.p-multiselect-item:hover) {
  background: theme('colors.gray.700');
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: theme('colors.gray.600') theme('colors.gray.800');
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: theme('colors.gray.800');
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: theme('colors.gray.600');
  border-radius: 4px;
}

:deep(.p-float-label) {
  display: block;
}

:deep(.p-float-label input:focus) ~ label,
:deep(.p-float-label input.p-filled) ~ label {
  background: theme('colors.gray.900');
  padding: 0 4px;
}
</style>
