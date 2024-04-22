<script setup lang="ts">
const chatStore = useChatStore()
const { question } = storeToRefs(chatStore)
</script>

<template>
  <div class="w-full">
    <PrimeInputGroup icon-position="left">
      <PrimeInputGroupAddon>
        <Icon
          name="material-symbols:school-rounded"
          class="w-6 h-6 hidden lg:block font-bold"
        />
      </PrimeInputGroupAddon>
      <PrimeInputText
        v-model="question"
        class="w-full"
        placeholder="Ask a question..."
        type="text"
        @keydown.enter="chatStore.submitQuestion(question)"
      />
      <PrimeInputGroupAddon>
        <PrimeButton
          :pt="{
            root: 'p-0'
          }"
          link
          @click="chatStore.submitQuestion(question)"
        >
          <Icon
            name="mdi:send"
            class="w-6 h-6 font-bold"
          />
        </PrimeButton>
      </PrimeInputGroupAddon>
    </PrimeInputGroup>
  </div>
</template>

<style scoped></style>
