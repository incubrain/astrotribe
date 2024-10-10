<template>
  <PrimeButton
    v-if="condition"
    class="background flex items-center justify-center rounded-md hover:text-primary-500"
    variant="none"
    :padded="false"
    @click="handleClick"
  >
    <div
      class="flex items-center justify-center gap-2 p-2 text-sm font-normal"
      :class="isPrev ? 'flex-row text-right' : 'flex-row-reverse text-left'"
    >
      <Icon
        :name="isPrev ? 'mdi:chevron-left' : 'mdi:chevron-right'"
        class="flex-shrink-0"
        size="24px"
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
    required: true,
  },
  isPrev: {
    type: Boolean,
    default: false,
  },
  post: {
    type: Object as () => NewsCardT,
    required: true,
  },
  handleClick: {
    type: Function,
    required: true,
  },
})
</script>
