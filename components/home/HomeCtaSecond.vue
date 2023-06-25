<template>
  <div class="flex items-center justify-center w-full h-full mx-auto">
    <div
      class="flex flex-col gap-8 p-8 justify-center items-center h-[360px] bg-primary-600 dark:bg-primary-800 w-full rounded-lg shadow-lg mx-auto"
    >
      <div class="text-center text-zinc-100">
        <h4 class="max-w-2xl pb-8 text-3xl font-bold">
          {{ title }}
        </h4>
        <p class="max-w-xl text-lg">
          {{ body }}
        </p>
      </div>
      <NuxtLink to="auth/register-interest">
        <UButton
          color="white"
          size="xl"
        >
          {{ cta }}
        </UButton>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String as PropType<string>,
    required: true
  },
  body: {
    type: String as PropType<string>,
    required: true
  },
  cta: {
    type: String as PropType<string>,
    required: true
  }
})
</script>

<style scoped></style>
