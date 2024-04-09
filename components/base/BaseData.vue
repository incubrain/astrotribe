<template>
  <div class="data-loader">
    <template v-if="error">
      <div class="error text-red-500"> Error loading data: {{ error.message }} </div>
    </template>
    <template v-else-if="loading">
      <div class="loading"> Loading... </div>
    </template>
    <template v-else>
      <slot :data="data"></slot>
    </template>
  </div>
</template>

<script setup>

// todo:med:2 make this robust and test

const props = defineProps({
  fetchData: Function
})

const data = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    loading.value = true
    data.value = await props.fetchData()
  } catch (err) {
    error.value = err
  } finally {
    loading.value = false
  }
})

watchEffect(() => {
  console.log('Data updated', data.value)
})
</script>

<style scoped>
/* Additional styling can be added here */
</style>
