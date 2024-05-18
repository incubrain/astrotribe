<script setup lang="ts">
const chatStore = useChatStore()
const { chat } = storeToRefs(chatStore)

definePageMeta({ name: 'Q&A', layout: 'app' })
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-[1fr_minmax(200px,600px)_1fr]">
    <div class="flex flex-col w-full md:col-start-2 gap-4 xl:gap-8 mx-auto">
      <div class="space-y-2">
        <h1 class="text-4xl font-semibold text-center">Your Galactic Guide </h1>
        <p class="text-lg font-semibold text-center">
          What've you always wanted to know?
        </p>
      </div>

      <div class="flex gap-4 px-4">
        <SearchBar />
      </div>
      <div
        v-if="chat.choices"
        class="space-y-4 xl:space-y-8"
      >
        <div>
          <PrimeInlineMessage
            severity="warn"
            :pt="{ root: 'flex justify-start', text: 'text-sm' }"
          >
            Experimental, please always validate answers.
          </PrimeInlineMessage>
        </div>
        <div class="p-4 bg-primary-900 rounded-md w-full">
          <MDC
            :value="chat.choices[0]?.message?.content"
            class="prose-invert prose"
          ></MDC>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
