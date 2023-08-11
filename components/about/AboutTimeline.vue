<template>
  <div class="relative grid w-full h-full grid-cols-1 gap-4 xl:gap-8 md:grid-cols-2">
    <div
      v-for="item in timeline"
      :key="item.title"
      class="relative flex items-start w-full border rounded-md border-color foreground"
    >
      <div class="flex flex-col justify-center w-full p-4">
        <h2 class="text-lg font-semibold leading-7 xl:leading-9">
          {{ item.title }}
        </h2>
        <h4 class="text-sm">
          {{ item.date }}
        </h4>
        <p class="mt-4 text-sm font-normal leading-6">
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
