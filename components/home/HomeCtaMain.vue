<template>
  <div class="flex justify-center items-center py-home w-full bg-black">
    <div class="flex flex-col gap-4 justify-center items-center">
      <h2 class="head-2 font-bold text-inverted"> {{ title }}</h2>
      <img
        class="ml-[-40px] w-[600px] rounded-full"
        src="/earth.png"
        alt=""
      />
      <p class="text-lg pt-4 pb-8 max-w-sm text-center leading-tight">{{ body }}</p>
      <v-btn color="primary"> Join Free Today </v-btn>
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
