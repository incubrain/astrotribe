<script setup lang="ts">
definePageMeta({
  layoutTransition: false,
  name: 'A-Chat',
  middleware: 'is-admin'
})

const agents = [
  {
    id: 1,
    name: 'Research Assistant',
    features: ['Find Papers', 'Bullet two'],
    basePrompt: 'This is an example base prompt'
  },
  {
    id: 2,
    name: 'Summarizer',
    features: ['Summarize all content consicely', 'Bullet two'],
    basePrompt: 'This is an example base prompt'
  }
]

const chunksStore = useChunksStore()
const { similarChunks } = storeToRefs(chunksStore)
</script>

<template>
  <div class="relative flex h-full w-full flex-col gap-4 overflow-hidden p-4 xl:p-8">
    <div class="jusify-center w-full items-center">
      <div class="flex gap-8">
        <PrimeButton
          v-for="agent in agents"
          :key="agent.id"
          outlined
        >
          {{ agent.name }}
        </PrimeButton>
      </div>
    </div>
    <AdminChatSearchResponse />
    <AdminChatMessageBar class="flex-shrink" />
  </div>
</template>

<style scoped></style>
