<template>
  <div
    class="flex relative justify-center items-center p-10 md:py-20 lg:py-40 mx-auto w-full bg-neutral-900 dark:bg-black"
  >
    <div class="flex flex-col gap-4 justify-center items-center text-light text-center">
      <h2 class="text-3xl font-bold">
        {{ title }}
      </h2>
      <p class="text-lg max-w-sm text-center leading-snug">
        {{ body }}
      </p>
      <NuxtLink to="auth/register-interest">
        <UButton
          color="primary"
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

<style scoped>
</style>
