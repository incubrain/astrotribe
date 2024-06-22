<template>
  <div class="wrapper padded-x mx-auto grid w-full grid-flow-col gap-4 p-4 lg:gap-8 lg:p-8">
    <div
      v-for="doc in similarChunks"
      :key="doc.id"
      class="border-color background rounded-lg border p-4"
    >
      <p> {{ doc }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const chunksStore = useChunksStore()
const { similarChunks } = storeToRefs(chunksStore)
</script>

<style scoped></style>
