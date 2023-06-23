<template>
  <div class="relative h-full w-full grid grid-cols-1 md:grid-cols-2 gap-6">
    <div
      v-for="item in timeline"
      :key="item.title"
      class="w-full flex items-start border border-color relative rounded-md foreground"
    >
      <div class="flex flex-col justify-center w-full p-4">
        <h2 class="font-bold text-lg lg:leading-9 leading-7">
          <!-- <UIcon
            name="i-material-symbols-star"
            class="w-4 h-4 rounded-full mr-2"
          /> -->
          {{ item.title }}
        </h2>
        <h4>
          {{ item.date }}
        </h4>
        <p class="font-normal text-base leading-6 mt-4">
          {{ item.body }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type TimelineObject = {
  date: string
  title: string
  body: string
  icon: string
}

defineProps({
  timeline: {
    type: Array as PropType<TimelineObject[]>,
    required: true
  }
})
</script>
