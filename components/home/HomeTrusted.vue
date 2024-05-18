<script setup lang="ts">
const trustedImages = [
  'images/trusted/dst.png',
  'images/trusted/iau-oad.png',
  'images/trusted/in-fed.png',
  'images/trusted/iimb-nsrcel.png'
];
</script>

<template>
  <div class="flex flex-col p-12 px-6 gap-8 bg-zinc-200 dark:bg-zinc-200 rounded-b-xl">
    <h4 class="block gap-4 text-lg font-bold text-center uppercase text-black"> Our Partners </h4>
    <div class="grid grid-cols-2 md:grid-cols-4 w-full gap-4 justify-between">
      <BaseImage
        v-for="(image, index) in trustedImages"
        :key="index"
        :img="{ src: image }"
        class="h-16 lg:h-20 mx-auto"
      />
    </div>
  </div>
</template>
