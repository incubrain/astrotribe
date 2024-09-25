<script setup lang="ts">
const { appLinks } = usePages()
</script>

<template>
  <div
    class="fixed bottom-0 left-0 flex-row w-full items-center justify-between foreground p-2 h-[var(--mobi-bottom-nav-height)] border-t border-color"
  >
    <ul class="flex flex-row items-center justify-center w-full h-full">
      <li
        v-for="page in appLinks"
        :key="page.id"
        class="flex items-center justify-center w-full h-full cursor-pointer"
      >
        <NuxtLink
          :to="page.slug"
          class="flex justify-center items-center"
        >
          <Icon
            :name="page.icon"
            size="24px"

          />
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
