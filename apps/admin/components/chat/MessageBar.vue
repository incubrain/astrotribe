<script setup lang="ts">
const message = ref('')
const messageInput = ref<Ref | null>(null)

const chunksStore = useChunksStore()

const handleKeyUp = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    sendMessage()
  }
}

type SearchType = 'fts' | 'vector'
const textSearchType = ref('fts' as SearchType)

const toggleTextSearchType = () => {
  if (textSearchType.value === 'fts') {
    textSearchType.value = 'vector'
  } else {
    textSearchType.value = 'fts'
  }
}

const sendMessage = () => {
  if (message.value.trim()) {
    console.log('Sending message:', message.value)
    chunksStore.fetchSimilarDocuments({ search: message.value, searchType: textSearchType.value })
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
        @click="toggleTextSearchType"
      >
        <Icon
          :name="textSearchType === 'fts' ? 'mdi:card-text-outline' : 'mdi:format-list-numbered'"
          class="absolute"
          size="24px"
        />
      </PrimeButton>
      <PrimeTextarea
        ref="messageInput"
        v-model="message"
        auto-resize
        placeholder="Ask Your Question..."
        class="flex max-h-[120px] w-full items-center justify-center bg-transparent px-4 py-2 outline-none"
        :pt="{ root: 'border-none' }"
        @keyup.enter="handleKeyUp"
      />
      <PrimeButton
        rounded
        :pt="{ root: 'p-5 flex justify-center items-center relative' }"
        severity="secondary"
      >
        <Icon
          name="mdi:send"
          class="absolute text-white"
          size="24px"
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
