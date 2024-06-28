<script setup lang="ts">
const chatStore = useChatStore()
const { chat } = storeToRefs(chatStore)

definePageMeta({ name: 'Q&A', layout: 'app' })
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-[1fr_minmax(200px,600px)_1fr]">
    <div class="mx-auto flex w-full flex-col gap-4 md:col-start-2 xl:gap-8">
      <div class="space-y-2">
        <h1 class="text-4xl font-semibold">Your Galactic Guide </h1>
        <p class="text-lg font-semibold"> Ask AI What you've always wanted to know! </p>
      </div>

      <div class="space-y-4">
        <div>
          <PrimeMessage
            severity="info"
            :pt="{ root: '', text: 'text-sm' }"
          >
            3 question limit in 30 minutes
          </PrimeMessage>
        </div>
        <PrimeMessage
          severity="warn"
          :pt="{ root: '', text: 'text-sm' }"
        >
          Experimental, please always validate answers.
        </PrimeMessage>
      </div>

      <SearchBar />
      <div
        v-if="chat.choices"
        class="space-y-4 xl:space-y-8"
      >
        <div class="w-full rounded-md bg-primary-900 p-4">
          <MDC
            :value="chat.choices[0]?.message?.content"
            class="prose prose-invert"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
