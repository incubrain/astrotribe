<script setup lang="ts">

defineProps({
  category: {
    type: String,
    required: true,
  },
})

const {
  getCategoryIcon,
  getCategoryColor,
  getCategoryIntensity,
  getCategoryTextColor,
} = useEventCategories()
</script>

<template>
  <div class="flex items-center gap-1">
    <div
      :class="`bg-${getCategoryColor(category)}-${getCategoryIntensity(category)}/20 p-1.5 rounded-full`"
    >
      <Icon
        :name="getCategoryIcon(category)"
        size="16px"
        :class="getCategoryTextColor(category)"
      />
    </div>
    <span
      :class="[
        'px-2 py-1 rounded-full text-xs',
        `bg-${getCategoryColor(category)}-${getCategoryIntensity(category)}/20`,
        getCategoryTextColor(category),
      ]"
    >
      {{ category }}
    </span>
  </div>
</template>
