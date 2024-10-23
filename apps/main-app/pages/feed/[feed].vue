<script setup lang="ts">
const route = useRoute()
const feedId = computed(() => String(route.params.feed))
const client = useSupabaseClient()

const categories = ref([])
const getCategories = async () => {
  const { data } = await client
    .from('feed_categories')
    .select('id, categories(id, name)')
    .eq('feed_id', feedId.value)

  categories.value = data.map((item) => item.categories)
}

onMounted(getCategories)
</script>

<template>
  <PrimeButton
    v-for="(category, index) in categories"
    :key="index"
    color="primary"
    :aria-label="category.name"
    :label="category.name"
    size="small"
    class="m-2"
  />
</template>
