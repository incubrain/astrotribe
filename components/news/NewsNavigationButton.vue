<template>
  <PrimeButton
    v-if="condition"
    class="background rounded-md hover:text-primary-500 flex items-center justify-center"
    variant="none"
    :padded="false"
    @click="handleClick"
  >
    <div
      class="flex justify-center items-center gap-2 p-2 text-sm font-normal"
      :class="isPrev ? 'flex-row text-right' : 'flex-row-reverse text-left'"
    >
      <Icon
        :name="isPrev ? 'mdi:chevron-left' : 'mdi:chevron-right'"
        class="w-6 h-6 flex-shrink-0"
      />
      {{ post.title.substring(0, 54) }}...
    </div>
  </PrimeButton>
</template>

<script setup lang="ts">
import type { NewsCardT } from '@/types/news'

defineProps({
  condition: {
    type: Boolean,
    required: true
  },
  isPrev: {
    type: Boolean,
    default: false
  },
  post: {
    type: Object as () => NewsCardT,
    required: true
  },
  handleClick: {
    type: Function,
    required: true
  }
})
</script>
