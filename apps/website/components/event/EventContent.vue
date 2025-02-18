<script setup lang="ts">
defineProps<{
  title: string
  categoryClass: string
  icon: string
  description: string
  time: string
  openEvent: () => void
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
    :class="`hidden md:flex md:p-2 text-white text-wrap rounded ${categoryClass}`"
  >
    <Icon
      v-if="icon"
      :name="icon"
    />
    <span>{{ title }}</span>
  </div>
  <PrimeButton
    class="flex md:hidden"
    @click="openEvent"
  >
    <Icon
      v-if="icon"
      :name="icon"
    />
  </PrimeButton>
</template>

<style scoped />
