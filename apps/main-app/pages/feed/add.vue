<script setup lang="ts">
import Fuse from 'fuse.js'

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

definePageMeta({
  name: 'Add Feed',
})
</script>

<template>
  <div class="max-w-7xl mx-auto p-4">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-semibold mb-2">Create New Feed</h1>
      <p class="text-gray-500">Select categories to include in your feed</p>
    </div>

    <!-- Main Card -->
    <PrimeCard class="bg-gray-900">
      <template #content>
        <!-- Top Section: Input Fields and Actions -->
        <div class="grid gap-4 md:grid-cols-2 mb-6">
          <div class="space-y-4">
            <div class="flex items-center w-full gap-2">
              <!-- Feed Name Input -->
              <PrimeFloatLabel class="grow">
                <PrimeInputText
                  id="feedname"
                  v-model="name"
                  class="w-full"
                  required
                />
                <label for="feedname">Enter feed name</label>
              </PrimeFloatLabel>
              <!-- Action Buttons -->
              <div class="flex gap-2">
                <PrimeButton
                  label="Save Feed"
                  @click="save"
                />
                <button
                  link
                  severity="danger"
                  @click="discard"
                >
                  <Icon
                    name="mdi:trash-can-outline"
                    size="22px"
                    class="text-red-500"
                  />
                </button>
              </div>
            </div>

            <!-- Search Input -->
            <PrimeFloatLabel>
              <PrimeInputText
                id="search"
                v-model="search"
                class="w-full"
              />
              <label for="search">Search categories</label>
            </PrimeFloatLabel>
          </div>

          <!-- Selected Categories Preview -->
          <PrimeCard class="bg-gray-800">
            <template #title>
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-400">Selected Categories</span>
                <PrimeBadge
                  :value="selectedCategories.length"
                  severity="info"
                />
              </div>
            </template>
            <template #content>
              <div class="flex flex-wrap gap-2">
                <PrimeChip
                  v-for="category in selectedCategories"
                  :key="category.id"
                  :label="category.name"
                  class="bg-blue-900"
                  removable
                  @remove="removeSelected(category.id)"
                />
              </div>
            </template>
          </PrimeCard>
        </div>

        <!-- Categories Grid -->
        <PrimeProgressSpinner
          v-if="proxyCategories.length === 0"
          class="w-8 h-8 mx-auto"
        />
        <div
          v-else
          class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
        >
          <PrimeButton
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :outlined="!category.selected"
            size="small"
            class="whitespace-normal h-auto py-2"
            @click="toggleSelect(category.id)"
          />
        </div>
      </template>
    </PrimeCard>
  </div>
</template>

<style scoped>
:deep(.p-card) {
  background: transparent;
}

:deep(.p-button) {
  justify-content: center;
}

:deep(.p-inputtext) {
  width: 100%;
}

:deep(.p-chip) {
  background: theme('colors.blue.900');
}
</style>
