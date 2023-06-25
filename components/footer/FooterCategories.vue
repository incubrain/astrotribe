<template>
  <ul>
    <li>
      <p class="text-lg font-semibold tracking-wide text-white">
        {{ category.title }}
      </p>
    </li>
    <li
      v-for="(link, linkIndex) in category.links"
      :key="linkIndex"
      class="mt-6"
    >
      <a
        href=""
        class="text-base tracking-wide text-white"
      >
        {{ link }}
      </a>
    </li>
  </ul>
</template>

<script setup lang="ts">
type Category = {
  title: string
  links: string[]
}

defineProps<{
  category: Category
}>()
</script>

<style scoped></style>
