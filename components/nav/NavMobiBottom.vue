<template>
  <div
    class="fixed bottom-0 left-0 flex-row w-full items-center justify-between foreground p-2 h-[var(--nav-height-mobi)] border-t border-color"
  >
    <ul class="flex flex-row items-center justify-center w-full h-full">
      <li
        v-for="page in pages"
        :key="page.id"
        class="flex items-center justify-center w-full h-full cursor-pointer"
      >
        <NuxtLink :to="page.slug" class="flex justify-center items-center">
          <UIcon
            :name="page.icon"
            class="w-[20px] h-[20px]"
          />
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const { pages } = usePages()

// const route = useRoute()
</script>

<style scoped></style>
