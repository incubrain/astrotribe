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
        class="object-cover object-left w-full h-full overflow-hidden rounded-lg"
        :src="imgSrc"
        format="webp"
        :alt="`${title} AstroTribe feature`"
      />
      <div
        class="absolute top-0 left-0 hidden w-full h-full rounded-lg dark:block bg-zinc-900/10"
      ></div>
    </div>
    <div class="md:w-[50%] px-4">
      <h4 class="mb-4 text-xl font-bold">
        {{ title }}
      </h4>
      <p class="pb-2 text-sm">
        {{ body }}
      </p>
      <a class="text-sm font-semibold text-success-600">{{ cta }}</a>
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
