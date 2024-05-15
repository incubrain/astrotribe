<template>
  <div class="flex items-center gap-4">
    <div class="w-[60px] h-[60px] object-contain rounded-full overflow-hidden relative">
      <BaseImage
        :img="{
          src: bortle.find((b) => b.id === p.rating)?.src,
          width: '80',
          height: '80',
          alt: 'bortle dark sky rating'
        }"
      />
      <p
        class="absolute top-0 left-0 flex items-center justify-center w-full h-full text-lg font-bold text-white"
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
  { id: 1, src: 'images/bortle/dark-skies-1.png' },
  { id: 2, src: 'images/bortle/dark-skies-2.png' },
  { id: 3, src: 'images/bortle/dark-skies-3.png' },
  { id: 4, src: 'images/bortle/dark-skies-4.png' },
  { id: 5, src: 'images/bortle/dark-skies-5.png' },
  { id: 6, src: 'images/bortle/dark-skies-6.png' },
  { id: 7, src: 'images/bortle/dark-skies-7.png' },
  { id: 8, src: 'images/bortle/dark-skies-8.png' }
]
</script>

<style scoped></style>
