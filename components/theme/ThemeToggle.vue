<template>
  <UIcon
    :name="color.value === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun'"
    class="w-5 h-5 md:w-6 md:h-6 cursor-pointer"
    @click="toggleDark"
  />
</template>

<script setup lang="ts">
const color = useColorMode()

useHead({
  meta: [
    {
      id: 'theme-color',
      name: 'theme-color',
      content: () => (color.value === 'dark' ? '#222222' : '#ffffff')
    }
  ]
})

function toggleDark() {
  color.preference = color.value === 'dark' ? 'light' : 'dark'
}
</script>

<style scoped></style>
