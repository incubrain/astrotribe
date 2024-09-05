<script setup lang="ts">
const props = defineProps<{
  selectedPrompt?: string
  systemPrompt?: string
}>()

const chatStore = useChatStore()
const { question, isLoading } = storeToRefs(chatStore)

watch(
  () => props.selectedPrompt,
  (newPrompt) => {
    if (newPrompt) {
      question.value = newPrompt
    }
  }
)

const submitQuestion = async () => {
  if (question.value.trim()) {
    await chatStore.submitQuestion({
      question: question.value,
      systemPrompt: props.systemPrompt
    })
    question.value = ''
  }
}
</script>

<template>
  <div class="w-full">
    <div class="mx-auto flex w-full max-w-3xl items-center">
      <div
        class="foreground border-color flex w-full items-center rounded-lg border px-2 py-1 pr-2"
      >
        <!-- <PrimeButton
          rounded
          :pt="{ root: 'p-5 flex justify-center items-center relative' }"
          severity="secondary"
        >
          <Icon
            :name="textSearchType === 'fts' ? 'mdi:card-text-outline' : 'mdi:format-list-numbered'"
            class="absolute h-5 w-5"
          />
        </PrimeButton> -->
        <PrimeTextarea
          ref="messageInput"
          v-model="question"
          auto-resize
          placeholder="Ask Your Question..."
          class="flex max-h-[120px] w-full items-center justify-center bg-transparent px-4 py-2 outline-none"
          :pt="{ root: 'border-none' }"
          @keyup.enter="submitQuestion"
        />
        <PrimeButton
          pt:root:class="p-0"
          link
          @click="submitQuestion"
        >
          <Icon
            :name="isLoading ? 'mdi:loading' : 'mdi:send'"
            class="h-6 w-6 font-bold text-primary-500"
            :class="isLoading ? 'animate-spin' : ''"
          />
        </PrimeButton>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
