<script setup lang="ts">
const { store, loadMore, refresh, isSelecting } = useSelectData('categories', {
  columns: 'id, name',
  orderBy: { column: 'name', ascending: true },
  limit: 100,
  initialFetch: true,
})

const name = ref(null)
const search = ref(null)

const { items: proxyCategories } = storeToRefs(store)

// Ensure that `selected` is part of the category data when initially fetched
const initializeSelection = () => {
  proxyCategories.value = proxyCategories.value.map((item) => ({
    ...item,
    selected: false, // Add `selected` property
  }))
}

// Call this when the data is fetched (initialFetch: true will fetch the data)
watchEffect(() => {
  if (proxyCategories.value.length > 0) {
    initializeSelection()
  }
})

// Toggle the `selected` property directly in `proxyCategories`
const toggleSelect = (id: string) => {
  const category = proxyCategories.value.find((item) => item.id === id)
  if (category) {
    category.selected = !category.selected // Toggle selected state directly
  }
}

const onSearch = () => {
  return proxyCategories.value.filter((item) => !search.value || item.name.includes(search.value))
}

const categories = computed(onSearch)

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
      <PrimeButton
        v-for="(category, index) in categories"
        :key="index"
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
</template>

<style scoped></style>
