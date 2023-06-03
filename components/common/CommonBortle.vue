<template>
  <div class="flex gap-4 items-center">
    <div class="w-[60px] h-[60px] object-contain rounded-full overflow-hidden relative">
      <img
        :src="bortle.find((b) => b.id === p.rating)?.src"
        alt="bortle dark sky rating"
        class=""
      />
      <p
        class="absolute w-full h-full flex items-center justify-center card-subheading text-white top-0 left-0 text-lg font-bold"
      >
        {{ p.rating }}
      </p>
    </div>
    <h3 class="text-lg font-semibold md:text-xl xl:text-2xl"> Bortle rating </h3>
  </div>
</template>

<script setup lang="ts">
const p = defineProps({
  rating: {
    type: Number as PropType<Number>,
    required: true
  }
})

const bortle = [
  { id: 1, src: '/bortle/dark-skies-1.png' },
  { id: 2, src: '/bortle/dark-skies-2.png' },
  { id: 3, src: '/bortle/dark-skies-3.png' },
  { id: 4, src: '/bortle/dark-skies-4.png' },
  { id: 5, src: '/bortle/dark-skies-5.png' },
  { id: 6, src: '/bortle/dark-skies-6.png' },
  { id: 7, src: '/bortle/dark-skies-7.png' },
  { id: 8, src: '/bortle/dark-skies-8.png' }
]
</script>

<style scoped></style>
