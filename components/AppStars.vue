<template>
  <div>
    <div class="h-full">
      <div class="flex gap-2 h-full leading-4">
        <div class="flex gap-1 items-center justify-center h-full relative group">
          <Icon
            v-for="i in 5"
            :key="i"
            :name="isStarFilled(i, rating / 2)"
            :size="`${starSize}px`"
            class="text-yellow-400"
          />
          <div
            class="absolute left-1/2 top-full mt-2 p-2 bg-gray-700 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition duration-200 ease-in-out transform -translate-x-1/2"
          >
            {{ rating.toPrecision(2) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  rating: {
    type: Number as PropType<number>,
    required: true
  },
  starSize: {
    type: Number as PropType<number>,
    default: 14
  }
})

const isStarFilled = (index: number, rating: number) => {
  if (index <= Math.floor(rating)) {
    return 'material-symbols:star'
  } else if (index - 0.5 <= rating) {
    return 'material-symbols:star-half'
  } else {
    return 'material-symbols:star-outline'
  }
}
</script>

<style scoped>
.group:focus .group-focus\:opacity-100 {
  opacity: 100 !important;
}
</style>
