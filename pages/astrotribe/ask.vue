<script setup lang="ts">
const chatStore = useChatStore()
const { chat } = storeToRefs(chatStore)

definePageMeta({ name: 'Q&A', layout: 'app' })
</script>

<template>
  <div class="flex flex-col p-4 xl:p-8 gap-4 xl:gap-8 max-w-[700px] mx-auto">
    <div class="flex flex-col gap-4 xl:gap-8">
      <div class="space-y-2">
        <h1 class="text-4xl font-semibold text-center">Your Galactic Guide </h1>
        <p class="text-lg font-semibold text-center">
          What is something you've always wanted to know, or been afraid to ask?
        </p>
      </div>
      <PrimeInlineMessage
        severity="warn"
        :pt="{ root: 'flex justify-start', text: 'text-sm' }"
      >
        This uses experimental AI, always validate before regarding answers as factual.
      </PrimeInlineMessage>
      <PrimeInlineMessage
        severity="info"
        :pt="{ root: 'flex justify-start', text: 'text-sm text-left' }"
      >
        Storing chat history and follow-up questions is coming as a premium feature.
      </PrimeInlineMessage>
    </div>
    <div class="flex gap-4">
      <SearchBar />
    </div>
    <div
      v-if="chat.choices"
      class="flex gap-4"
    >
      <span class="pt-4">A</span>
      <div class="p-4 bg-primary-900 rounded-md w-full">
        <MDC
          :value="chat.choices[0]?.message?.content"
          class="prose-invert prose"
        ></MDC>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
