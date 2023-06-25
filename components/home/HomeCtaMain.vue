<template>
  <div
    class="relative flex items-center justify-center w-full p-10 mx-auto md:py-20 lg:py-40 bg-neutral-900 dark:bg-black"
  >
    <div class="flex flex-col items-center justify-center gap-4 text-center text-light">
      <h2 class="text-3xl font-bold">
        {{ title }}
      </h2>
      <p class="max-w-sm text-lg leading-snug text-center">
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

<style scoped></style>
