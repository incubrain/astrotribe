<template>
  <div
    v-if="navigation"
    class="my-4 grid grid-cols-2 gap-4"
  >
    <NuxtLink
      v-if="navigation[0]"
      :to="navigation[0]._path"
      class="border-color flex cursor-pointer items-center justify-start gap-2 border p-4 lg:rounded-md"
    >
      <h3 class="flex items-center justify-center gap-4 text-sm font-semibold lg:text-xl">
        <div class="foreground relative flex items-center justify-center rounded-full p-5">
          <Icon
            name="mdi:chevron-left"
            class="absolute inline-block shrink-0"
            size="32px"
          />
        </div>
        {{ navigation[0].title }}
      </h3>
    </NuxtLink>
    <NuxtLink
      v-if="navigation[1]"
      :to="navigation[1]._path"
      class="border-color flex cursor-pointer items-center justify-end gap-2 border p-4 lg:rounded-md"
    >
      <h3 class="flex items-center justify-between gap-4 text-sm font-semibold lg:text-xl">
        {{ navigation[1].title }}
        <div class="foreground relative flex items-center justify-center rounded-full p-5">
          <Icon
            name="mdi:chevron-right"
            class="absolute inline-block shrink-0"
            size="32px"
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
    .findSurround(route.path),
)
</script>

<style scoped></style>
