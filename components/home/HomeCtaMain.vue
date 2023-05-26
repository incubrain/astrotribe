<template>
  <div
    class="flex justify-center items-center py-[40px] md:py-[80px] lg:py-[160px] mx-auto w-full bg-neutral-950 dark:bg-black"
  >
    <div class="flex flex-col gap-4 justify-center items-center">
      <h2 class="text-3xl font-bold text-inverted">
        {{ title }}
      </h2>
      <p class="text-lg pt-4 max-w-sm text-center leading-tight">
        {{ body }}
      </p>
      <img
        class="ml-[-40px] w-[600px] rounded-full"
        src="/earth.png"
        alt=""
      />
      <UButton
        color="white"
        size="xl"
      >
        {{ cta }}
      </UButton>
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
