<template>
  <div>
    <p> {{ expertise }}</p>
  </div>
</template>

<script setup lang="ts">

defineProps<{
    expertise: string,
}>()

</script>

<style scoped>

</style>
