<template>
  <div
    class="relative text-black flex-row w-full items-center justify-between border-t border-slate-300 p-2 bg-white"
  >
    <ul class="flex h-full flex-row items-center justify-center w-full">
      <li
        v-for="page in pages"
        :key="page.id"
        class="flex w-full h-full justify-center cursor-pointer items-center"
      >
        <NuxtLink :to="page.slug">
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
