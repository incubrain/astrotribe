<template>
  <div class="flex items-center justify-center w-full h-full p-12 rounded-md shadow-md">
    <div
      v-for="t in store"
      :key="t.id"
    >
      <p> realtime: {{ t }} </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { table, store } = useRealtime()

table.single()
</script>

<style scoped></style>
