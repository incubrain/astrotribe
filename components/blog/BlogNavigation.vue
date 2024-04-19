<template>
  <div
    v-if="navigation"
    class="grid grid-cols-2 gap-4 my-4"
  >
    <NuxtLink
      v-if="navigation[0]"
      :to="navigation[0]._path"
      class="flex border border-color items-center justify-start gap-2 lg:rounded-md cursor-pointer p-4"
    >
      <h3 class="text-sm lg:text-xl font-semibold flex justify-center items-center gap-4">
        <div class="p-5 foreground rounded-full relative items-center justify-center flex">
          <Icon
            name="mdi:chevron-left"
            class="h-5 w-5 lg:h-7 lg:w-7 inline-block shrink-0 absolute"
          />
        </div>
        {{ navigation[0].title }}
      </h3>
    </NuxtLink>
    <NuxtLink
      v-if="navigation[1]"
      :to="navigation[1]._path"
      class="flex border border-color justify-end items-center gap-2 lg:rounded-md cursor-pointer p-4"
    >
      <h3 class="text-sm lg:text-xl font-semibold flex justify-between items-center gap-4">
        {{ navigation[1].title }}
        <div class="p-5 foreground rounded-full relative items-center justify-center flex">
          <Icon
            name="mdi:chevron-right"
            class="h-5 w-5 lg:h-7 lg:w-7 inline-block shrink-0 absolute"
          />
        </div>
      </h3>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const { data: navigation } = await useAsyncData('navigation', () =>
  queryContent()
    .where({ _partial: { $ne: true }, status: 'published' })
    .only(['_path', 'title', 'publishedAt'])
    .sort({ publishedAt: 1 })
    .findSurround(route.path)
)
</script>

<style scoped></style>
