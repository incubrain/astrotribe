<template>
  <div class="flex flex-col relative h-full w-full">
    <!-- <SummaryLevel /> -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mx-auto md:gap-4 xl:gap-8">
      <ResearchCard
        v-for="(research, i) in data.research"
        :key="`research-post-${i}`"
        :research="research"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

const { data, error } = await useFetch('/api/research/all')

if (error.value) {
  console.error(error.value)
}

definePageMeta({
  name: 'Research',
  layout: 'app'
})
</script>
