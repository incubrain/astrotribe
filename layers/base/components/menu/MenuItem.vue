<script setup lang="ts">
const emit = defineEmits(['click'])

defineProps<{
  icon?: string
  label: string
  to?: string
  isActive?: boolean
  isMobile?: boolean
  isSidebarOpen?: boolean
}>()

const handleClick = (e: Event) => {
  emit('click')
}
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="flex items-center rounded-lg px-2 py-2 text-sm font-medium hover:bg-primary-700"
    :class="{ 'bg-primary-800': isActive }"
    @click.up="handleClick"
  >
    <Icon
      v-if="icon"
      :name="icon"
      size="20px"
      class="mr-3 flex-shrink-0"
    />
    <span v-if="isMobile || isSidebarOpen">{{ label }}</span>
  </NuxtLink>
</template>
