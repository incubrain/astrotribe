<script setup lang="ts">
const chatStore = useChatStore()
const { question, isLoading } = storeToRefs(chatStore)

const userStore = useCurrentUser()
const { userId } = storeToRefs(userStore)

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
        @keydown.enter="chatStore.submitQuestion(userId)"
      />
      <PrimeInputGroupAddon>
        <PrimeButton
          :pt="{
            root: 'p-0'
          }"
          link
          @click="chatStore.submitQuestion(userId)"
        >
          <Icon
            :name="isLoading ? 'mdi:loading' : 'mdi:send'"
            class="w-6 h-6 font-bold"
            :class="isLoading ? 'animate-spin' : ''"
          />
        </PrimeButton>
      </PrimeInputGroupAddon>
    </PrimeInputGroup>
  </div>
</template>

<style scoped></style>
