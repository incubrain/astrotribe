<template>
  <div
    :class="
      imageRight
        ? 'flex flex-col md:flex-row-reverse justify-between items-center w-full mx-auto gap-10'
        : 'flex flex-col md:flex-row justify-between items-center w-full mx-auto gap-10'
    "
  >
    <div class="md:w-[70%] h-[360px] aspect-auto shadow-2xl relative">
      <NuxtImg
        class="w-full h-full rounded-lg object-cover object-left overflow-hidden"
        :src="imgSrc"
        format="webp"
        :alt="`${title} AstroTribe feature`"
      />
      <div
        class="absolute hidden dark:block w-full h-full bg-zinc-900/10 top-0 left-0 rounded-lg"
      ></div>
    </div>
    <div class="md:w-[50%] px-4">
      <h4 class="text-xl font-bold mb-4">
        {{ title }}
      </h4>
      <p class="text-sm pb-2">
        {{ body }}
      </p>
      <a class="text-success-600 text-sm font-semibold">{{ cta }}</a>
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
  },
  imageRight: {
    type: Boolean as PropType<boolean>,
    required: true
  },
  imgSrc: {
    type: String as PropType<string>,
    required: true
  }
})
</script>

<style scoped></style>
