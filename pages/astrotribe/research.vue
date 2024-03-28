<template>
  <div class="flex flex-col relative h-full w-full">
    <!-- <SummaryLevel /> -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mx-auto md:gap-4 xl:gap-8">
      <ResearchCard
        v-for="(research, i) in allData"
        :key="`research-post-${i}`"
        :research="research"
      />
    </div>
    <AppDetectBottom
      v-show="!dataFinished && !pending"
      @bottom-trigger="refresh"
    />
  </div>
</template>

<script setup lang="ts">
const dataFinished = ref(false)
const allData = ref([])
const pagination = reactive({ skip: 0, limit: 19 })

const { error, pending, refresh } = await useAsyncData('research', async (): Promise<void> => {
  const { research, error } = await $fetch('/api/research/all', {
    query: { skip: pagination.skip, limit: pagination.limit }
  })

  if (error) {
    console.error(error)
    return
  }

  if (!research.length || research.length < pagination.limit) {
    dataFinished.value = true
    return
  }

  pagination.skip += pagination.limit
  await new Promise((resolve) => setTimeout(resolve, 1200))
  allData.value.push(...research)
})

if (error.value) {
  console.error(error.value)
}

definePageMeta({
  name: 'Research',
  layout: 'app'
})
</script>
