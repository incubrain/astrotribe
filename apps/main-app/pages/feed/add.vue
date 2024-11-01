<script setup lang="ts">
import Fuse from 'fuse.js'

const { store, loadMore, refresh, isSelecting } = useSelectData('categories', {
  columns: 'id, name',
  orderBy: { column: 'name', ascending: true },
  limit: 100,
  initialFetch: true,
})

const name = ref(null)
const search = ref('') // Initialize with empty string instead of null
const fuseInstance = ref<Fuse<any> | null>(null)

const { items: proxyCategories } = storeToRefs(store)

// Initialize Fuse.js instance when categories are loaded
watchEffect(() => {
  if (proxyCategories.value.length > 0) {
    initializeSelection()
    // Configure Fuse with your preferred options
    fuseInstance.value = new Fuse(proxyCategories.value, {
      keys: ['name'],
      threshold: 0.3,
      distance: 100,
      ignoreLocation: true,
      shouldSort: true,
    })
  }
})

// Ensure that `selected` is part of the category data when initially fetched
const initializeSelection = () => {
  proxyCategories.value = proxyCategories.value.map((item) => ({
    ...item,
    selected: false,
  }))
}

const toggleSelect = (id: string) => {
  const category = proxyCategories.value.find((item) => item.id === id)
  if (category) {
    category.selected = !category.selected
  }
}

const onSearch = () => {
  // Only perform search if there's actual search text and it's at least 2 characters
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

const save = async () => {
  const toast = useNotification()
  const selected = proxyCategories.value.filter((item) => item.selected)

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
            message: `${name} was created successfully`,
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
  name.value = null
  const selected = proxyCategories.value.filter((item) => item.selected)

  selected.forEach((item) => (item.selected = false))
}

definePageMeta({
  name: 'Add Feed',
})
</script>

<template>
  <div>
    <div class="flex p-2 justify-between w-full items-center">
      <h3 class="flex h-full items-center text-xl font-semibold leading-none">
        Pick the tags you want to include
      </h3>
      <div class="flex gap-2">
        <PrimeButton @click="discard">Discard</PrimeButton>
        <PrimeButton @click="save">Save</PrimeButton>
      </div>
    </div>
    <hr />
    <div>
      <PrimeFloatLabel class="flex flex-col m-6 w-50">
        <PrimeInputText
          id="feedname"
          v-model="name"
          required
        />
        <label for="feedname">Enter feed name</label>
      </PrimeFloatLabel>
      <PrimeFloatLabel class="flex flex-col m-6 w-50">
        <PrimeInputText
          id="search"
          v-model="search"
          @input="onSearch"
        />
        <label for="search">Search</label>
      </PrimeFloatLabel>
    </div>
    <div class="text-center">
      <div
        v-if="proxyCategories.length === 0"
        class="p-4 text-gray-500"
      >
        Loading categories...
      </div>
      <div v-else>
        <PrimeButton
          v-for="(category, index) in categories"
          :key="category.id"
          color="primary"
          :aria-label="category.name"
          :outlined="!category.selected"
          :label="category.name"
          size="small"
          class="cursor-pointer m-2 bg-black"
          @click="toggleSelect(category.id)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
