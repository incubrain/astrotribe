<template>
  <div
    :class="
      imageRight
        ? 'mx-auto flex w-full flex-col items-center justify-between gap-10 md:flex-row-reverse'
        : 'mx-auto flex w-full flex-col items-center justify-between gap-10 md:flex-row'
    "
  >
    <div class="relative aspect-auto h-[360px] shadow-2xl md:w-[70%]">
      <IBImage
        :img="{
          src: imgSrc,
          alt: `${title} AstroTribe feature`,
          format: 'webp',
        }"
        class="h-full w-full overflow-hidden rounded-lg object-cover object-left"
      />
      <div
        class="absolute left-0 top-0 h-full w-full rounded-lg bg-zinc-900/10 block"
      />
    </div>
    <div class="px-4 md:w-[50%]">
      <h4 class="mb-4 text-xl font-bold">
        {{ title }}
      </h4>
      <p class="pb-2 text-sm">
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
    required: true,
  },
  body: {
    type: String as PropType<string>,
    required: true,
  },
  cta: {
    type: String as PropType<string>,
    required: true,
  },
  imageRight: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
  imgSrc: {
    type: String as PropType<string>,
    required: true,
  },
})
</script>

<style scoped></style>
