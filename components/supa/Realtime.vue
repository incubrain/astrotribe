<template>
  <div class="flex justify-center items-center w-full h-full p-12 shadow-md rounded-md">
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
