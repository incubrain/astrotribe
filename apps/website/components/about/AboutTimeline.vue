<template>
  <div class="relative grid h-full w-full grid-cols-1 gap-4 md:grid-cols-2 xl:gap-8">
    <LandingGlass
      v-for="item in timeline"
      :key="item.title"
      color="emerald"
      :padded="false"
    >
      <div class="flex w-full flex-col justify-center p-6">
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
    </LandingGlass>
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
    required: true,
  },
})
</script>
