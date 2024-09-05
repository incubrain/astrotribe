<script setup lang="ts">
const trustedImages = [
  'images/trusted/dst.png',
  'images/trusted/iau-oad.png',
  'images/trusted/in-fed.png',
  'images/trusted/iimb-nsrcel.png',
]
</script>

<template>
  <div class="flex flex-col gap-8 rounded-b-xl bg-zinc-200 p-12 px-6 dark:bg-zinc-200">
    <h4 class="text-lg block gap-4 text-center font-bold uppercase text-black">
      Our Partners
    </h4>
    <div class="grid w-full grid-cols-2 justify-between gap-4 md:grid-cols-4">
      <IBImage
        v-for="(image, index) in trustedImages"
        :key="index"
        :img="{ src: image }"
        class="mx-auto h-16 lg:h-20"
      />
    </div>
  </div>
</template>
