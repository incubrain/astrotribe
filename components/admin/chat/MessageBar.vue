<script setup lang="ts">
const message = ref('')
const inputHeight = ref(36)
const maxHeight = 120
const textareaHeight = computed(() => `${inputHeight.value}px`)
const messageInput = ref<Ref | null>(null)

const chunksStore = useChunksStore()

const handleKeyUp = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    sendMessage()
  }
}

const sendMessage = () => {
  if (message.value.trim()) {
    console.log('Sending message:', message.value)
    chunksStore.fetchSimilarDocuments({ search: message.value })
    message.value = ''
  }
}
</script>

<template>
  <div class="mx-auto flex w-full max-w-3xl items-center">
    <div
      class="foreground border-color flex w-full items-center rounded-full border px-2 py-1 pr-2"
    >
      <PrimeButton
        rounded
        :pt="{ root: 'p-5 flex justify-center items-center relative' }"
        severity="secondary"
      >
        <Icon name="mdi:attachment" class="absolute w-5 h-5" />
      </PrimeButton>
      <PrimeTextarea
        ref="messageInput"
        v-model="message"
        @keyup.enter="handleKeyUp"
        autoResize
        placeholder="Ask Your Question..."
        class="flex max-h-[120px] w-full items-center justify-center bg-transparent px-4 py-2 outline-none"
        :pt="{ root: 'border-none' }"
      />
      <PrimeButton
        rounded
        :pt="{ root: 'p-5 flex justify-center items-center relative' }"
        severity="secondary"
      >
        <Icon
          name="mdi:send"
          class="absolute h-5 w-5 text-white"
        />
      </PrimeButton>
    </div>
  </div>
</template>

<style scoped>
.p-inputtextarea {
  overflow: scroll !important;
}
</style>
