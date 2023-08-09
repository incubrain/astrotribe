<template>
  <a
    class="cursor-pointer"
    target="_blank"
    :href="url"
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
  url: {
    type: String,
    required: true
  }
})
</script>
