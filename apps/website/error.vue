// error.vue
<script setup lang="ts">
const props = defineProps({
  error: Object,
})

const nuxtApp = useNuxtApp()

console.log('🚨 [Debug] Error page details:', {
  error: props.error,
  route: useRoute(),
  nuxtAppState: {
    isHydrating: nuxtApp.isHydrating,
    payload: nuxtApp.payload,
  },
})
</script>

<template>
  <div>
    <h1>Error: {{ error?.message }}</h1>
    <pre>{{ error }}</pre>
  </div>
</template>
