<script setup lang="ts">
const chatStore = useChatStore()
const { chat } = storeToRefs(chatStore)

definePageMeta({ name: 'Q&A', layout: 'app' })
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-[1fr_minmax(200px,600px)_1fr]">
    <div class="flex flex-col w-full md:col-start-2 gap-4 xl:gap-8 mx-auto">
      <div class="space-y-2">
        <h1 class="text-4xl font-semibold">Your Galactic Guide </h1>
        <p class="text-lg font-semibold"> Ask AI What you've always wanted to know! </p>
      </div>

      <div class="space-y-4">
        <div>
          <PrimeInlineMessage
            severity="info"
            :pt="{ root: '', text: 'text-sm' }"
          >
            3 question limit in 30 minutes
          </PrimeInlineMessage>
        </div>
        <PrimeInlineMessage
          severity="warn"
          :pt="{ root: '', text: 'text-sm' }"
        >
          Experimental, please always validate answers.
        </PrimeInlineMessage>
      </div>

      <SearchBar />
      <div
        v-if="chat.choices"
        class="space-y-4 xl:space-y-8"
      >
        <div class="p-4 bg-primary-900 rounded-md w-full">
          <MDC
            :value="chat.choices[0]?.message?.content"
            class="prose-invert prose"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
