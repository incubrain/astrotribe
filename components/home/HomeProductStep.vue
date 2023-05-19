<template>
  <div
    class="flex justify-between items-center w-full py-home gap-10"
    :style="!imageRight ? { flexDirection: 'row-reverse' } : { flexDirection: 'row' }"
  >
    <div class="w-[50%] px-4">
      <h4 class="head-4 text-dark font-bold mb-4">
        {{ title }}
      </h4>
      <p class="text-base text-dark py-2">
        {{ body }}
      </p>
      <a class="text-link text-base">{{ cta }}</a>
    </div>
    <div class="w-100% h-[360px] rounded-lg overflow-hidden shadow-2xl">
      <img
        class="w-full h-full"
        src="/cover1.jpg"
        alt=""
      />
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
  }
})
</script>

<style scoped></style>
