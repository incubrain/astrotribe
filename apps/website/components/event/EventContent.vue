<template>
  <div
    v-tooltip="{
      value: description,
      pt: {
        text: '!bg-primary-950 !w-fit !rounded !p-2 !text-white !font-medium !max-w-xs',
      },
    }"
    :class="`hidden md:flex md:p-2 text-white text-wrap rounded gap-1 items-center ${categoryClass}`"
  >
    <Icon
      v-if="icon"
      :name="icon"
      size="16px"
      class="flex-shrink-0"
    />
    <span class="truncate">{{ title }}</span>
  </div>
  <PrimeButton
    class="flex md:hidden !p-2"
    :severity="getSeverity(categoryClass)"
    rounded
    @click="openEvent"
  >
    <Icon
      v-if="icon"
      :name="icon"
      size="16px"
    />
  </PrimeButton>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  categoryClass: string
  icon: string
  description: string
  time: string
  openEvent: () => void
}>()

// Map category classes to PrimeVue button severities
const getSeverity = (categoryClass: string) => {
  if (categoryClass.includes('bg-gray')) return 'secondary'
  if (categoryClass.includes('bg-red')) return 'danger'
  if (categoryClass.includes('bg-yellow')) return 'warning'
  if (categoryClass.includes('bg-purple')) return 'help'
  if (categoryClass.includes('bg-indigo')) return 'info'
  if (categoryClass.includes('bg-blue')) return 'primary'
  return 'secondary'
}
</script>

<style scoped>
/* Add subtle glow effect to events */
div[v-tooltip] {
  box-shadow: 0 0 8px rgba(var(--primary-500-rgb), 0.3);
  transition: all 0.2s ease;
}

div[v-tooltip]:hover {
  box-shadow: 0 0 12px rgba(var(--primary-400-rgb), 0.5);
  transform: translateY(-1px);
}
</style>
