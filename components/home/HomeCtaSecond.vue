<template>
  <div class="flex items-center justify-center w-full h-full mx-auto">
    <div
      :class="`flex flex-col gap-4 xl:gap-8 p-4 xl:p-8 justify-${alignement} text-${alignement} text-zinc-100 bg-primary-600 dark:bg-primary-950 w-full rounded-lg shadow-lg mx-auto`"
    >
      <h2 class="max-w-2xl text-xl xl:text-2xl font-bold `">
        {{ title }}
      </h2>
      <h4 class="max-w-xl text-base font-semibold">
        {{ body }}
      </h4>
      <slot />
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
  alignement: {
    type: String as PropType<string>,
    default: 'center'
  }
})
</script>

<style scoped></style>
