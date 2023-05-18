<template>
  <ul>
    <li>
      <p class="text-lg text-white tracking-wide font-semibold">
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
        class="text-base text-white tracking-wide"
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

<style scoped>

</style>
