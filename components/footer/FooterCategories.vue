<script setup lang="ts">
type Category = {
  title: string
  links: string[]
}

defineProps<{
  category: Category
}>()
</script>

<template>
  <ul>
    <li>
      <p class="text-lg font-semibold tracking-wide text-white">
        {{ category.title }}
      </p>
    </li>
    <li
      v-for="(link, linkIndex) in category.links"
      :key="`footer-link-${linkIndex}`"
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

<style scoped></style>
