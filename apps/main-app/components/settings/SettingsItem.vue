<script setup lang="ts">
interface SettingsItemProps {
  item: {
    label: string
    tip?: string
    id?: string
  }
}

defineProps<SettingsItemProps>()
</script>

<template>
  <div
    class="flex flex-col md:flex-row gap-4 md:gap-8 w-full py-4 border-b border-gray-800 last:border-b-0"
  >
    <div class="flex flex-col gap-1 md:w-48">
      <p class="text-lg font-medium">
        {{ item.label }}
      </p>
      <p
        v-if="item.tip"
        class="text-sm text-gray-400"
      >
        {{ item.tip }}
      </p>
    </div>
    <div class="flex-grow">
      <slot />
    </div>
  </div>
</template>
