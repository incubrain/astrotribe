<script setup lang="ts">
defineProps<{
  title: string
  categoryClass: string
  icon: string
  description: string
  time: string
}>()
</script>

<template>
  <div
    v-tooltip="{
      value: description,
      pt: {
        text: '!bg-black !w-fit !rounded !p-2 !text-white !font-medium',
      },
    }"
    :class="`p-2 text-white text-wrap rounded ${categoryClass}`"
  >
    <Icon
      v-if="icon"
      :name="icon"
    />
    {{ title }}
  </div>
</template>

<style scoped />
