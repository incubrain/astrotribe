<template>
  <a href="">
    <IconSvg :name="type" />
  </a>
</template>

<script setup lang="ts">
defineProps({
  type: String
})
</script>
