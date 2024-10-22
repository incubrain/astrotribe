<script setup lang="ts">
const { store, loadMore, refresh, isSelecting } = useSelectData('categories', {
  columns: 'id, name',
  orderBy: { column: 'name', ascending: true },
  limit: 100,
  initialFetch: true,
})

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

// Use computed to return categories
const categories = computed(() => proxyCategories.value)

// Toggle the `selected` property directly in `proxyCategories`
const toggleSelect = (id: string) => {
  const category = proxyCategories.value.find((item) => item.id === id)
  if (category) {
    category.selected = !category.selected // Toggle selected state directly
  }
}

const save = () => {
  const selected = proxyCategories.value.filter((item) => item.selected)
}

const discard = () => {
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
        <PrimeInputText id="feedname" />
        <label for="feedname">Enter feed name</label>
      </PrimeFloatLabel>
      <PrimeFloatLabel class="flex flex-col m-6 w-50">
        <PrimeInputText id="search" />
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
