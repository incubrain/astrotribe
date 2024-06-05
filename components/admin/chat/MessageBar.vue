<script setup lang="ts">
const message = ref('')
const inputHeight = ref(24)
const textareaHeight = computed(() => `${inputHeight.value}px`)
const maxHeight = ref(120)
const messageInput = ref<Ref | null>(null)

const sendMessage = () => {
  if (message.value.trim()) {
    console.log('Sending message:', message.value)
    message.value = ''
    adjustHeight()
  }
}

const adjustHeight = () => {
  if (messageInput.value) {
    console.log('Adjusting height', messageInput.value)
    inputHeight.value = messageInput.value.$el.scrollHeight
  }
}

// Watch for changes in the message input to adjust the height dynamically
watch(message, adjustHeight)
</script>

<template>
  <div class="w-full flex items-center max-w-3xl mx-auto">
    <div
      class="flex items-center foreground rounded-full w-full pr-2 border border-color px-2 py-1"
    >
      <PrimeButton
        rounded
        :pt="{ root: 'p-5 flex justify-center items-center relative' }"
        severity="secondary"
      >
        <Icon
          name="mdi:attachment"
          class="text-white w-5 h-5 absolute"
        />
      </PrimeButton>
      <PrimeTextarea
        ref="messageInput"
        v-model="message"
        @input="adjustHeight"
        placeholder="Message ChatGPT"
        :style="{ height: textareaHeight, maxHeight: '120px' }"
        class="w-full px-4 py-2 bg-transparent outline-none flex items-center justify-center overflow-scroll"
        :pt="{ root: 'border-none' }"
      />
      <PrimeButton
        rounded
        :pt="{ root: 'p-5 flex justify-center items-center relative' }"
        severity="secondary"
      >
        <Icon
          name="mdi:send"
          class="text-white w-5 h-5 absolute"
        />
      </PrimeButton>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles if needed */
</style>
