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
    <PrimeInputGroup icon-position="left">
      <PrimeInputGroupAddon>
        <Icon
          name="material-symbols:school-rounded"
          class="hidden h-6 w-6 font-bold lg:block"
        />
      </PrimeInputGroupAddon>
      <PrimeInputText
        v-model="question"
        class="w-full"
        placeholder="Ask a question..."
        pt:root:class="border-none"
        :ptOptions="{ mergeProps: true, mergeSections: true }"
        type="text"
        @keydown.enter="submitQuestion"
      />
      <PrimeInputGroupAddon>
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
      </PrimeInputGroupAddon>
    </PrimeInputGroup>
  </div>
</template>

<style scoped></style>
