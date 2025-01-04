<script setup lang="ts">
// todo:med:1 - turn this into a baseStar component, then use in places like rating etc
defineProps({
  rating: {
    type: Number as PropType<number>,
    required: true,
  },
  starSize: {
    type: Number as PropType<number>,
    default: 14,
  },
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

<template>
  <div>
    <div class="h-full">
      <div class="flex h-full gap-2 leading-4">
        <div class="group relative flex h-full items-center justify-center gap-1">
          <Icon
            v-for="i in 5"
            :key="i"
            :name="isStarFilled(i, rating / 2)"
            class="text-yellow-400"
            :size="`${starSize}px`"
          />
          <div
            class="absolute left-1/2 top-full mt-2 -translate-x-1/2 transform rounded p-2 text-xs opacity-0 shadow-lg transition duration-200 ease-in-out group-hover:opacity-100 group-focus:opacity-100"
          >
            {{ rating.toPrecision(2) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.group:focus .group-focus\:opacity-100 {
  opacity: 100 !important;
}
</style>
