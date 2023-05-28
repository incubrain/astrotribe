<template>
  <div>
    <div class="rounded-[100%_100%_0_0] relative h-[300px] bg-neutral-900 dark:bg-black"></div>
    <div class="flex relative justify-center items-center py-10 md:py-20 lg:py-40 mx-auto w-full bg-neutral-900 dark:bg-black">
      <div class="flex flex-col gap-4 justify-center items-center">
        <h2 class="text-3xl font-bold text-white">
          {{ title }}
        </h2>
        <p class="text-lg pt-4 max-w-sm text-center leading-snug">
          {{ body }}
        </p>
        <img class="ml-[-40px] w-[600px] rounded-full" src="/earth.png" alt="" />
        <UButton color="white" size="xl">
          {{ cta }}
        </UButton>
      </div>
    </div>
    <div class="rounded-[0_0_100%_100%] relative h-[300px] bg-neutral-900 dark:bg-black"></div>
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

.curved {
  border-bottom-left-radius: 50% 100%;
  border-bottom-right-radius: 50% 100%;
}

.curved2::after {
  border-top-left-radius: 50% 100%;
  border-top-right-radius: 50% 100%;
}

</style>
