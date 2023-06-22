<template>
  <a
    class="cursor-pointer"
    target="_blank"
    :href="link"
  >
    <UIcon
      :name="`i-mdi-${platform}`"
      class="w-[24px] h-[24px]"
    />
  </a>
</template>

<script setup lang="ts">
defineProps({
  platform: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  }
})
</script>
