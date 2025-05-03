<script setup lang="ts">
defineProps({
  categories: {
    type: Array,
    required: true,
  },
  activeFilters: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['toggle-filter'])
</script>

<template>
  <UiHorizontalScroll>
    <div class="inline-flex gap-2 py-1 px-2">
      <div
        v-for="category in categories"
        :key="category.name"
        :class="[
          'flex items-center gap-1 px-3 py-1.5 rounded-full cursor-pointer transition-all duration-300 whitespace-nowrap',
          activeFilters.includes(category.name)
            ? `bg-${category.color}-${category.colorIntensity}/30 text-${category.color}-${parseInt(category.colorIntensity) - 100}`
            : 'bg-primary-900/30 text-gray-400',
        ]"
        @click="emit('toggle-filter', category.name)"
      >
        <Icon
          :name="category.icon"
          size="16px"
          :class="
            activeFilters.includes(category.name)
              ? `text-${category.color}-${category.colorIntensity}`
              : ''
          "
        />
        <span class="text-sm">{{ category.name }}</span>
      </div>
    </div>
  </UiHorizontalScroll>
</template>
