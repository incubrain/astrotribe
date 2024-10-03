<template>
  <div :class="`flex flex-col gap-4 lg:gap-6 text-${alignment} lg:max-w-lg`">
    <p
      v-if="title.label"
      class="text-sm font-bold uppercase"
      :class="labelWhite ? 'text-white' : 'text-primary-700'"
    >
      {{ title.label }}
    </p>
    <h3
      class="text-2xl lg:text-4xl font-bold"
      :class="isCta ? 'underline decoration-primary-900' : ''"
    >
      {{ title.main }}
    </h3>
    <h5
      v-if="title.subtitle"
      class="text-base"
    >
      {{ title.subtitle }}
    </h5>
    <div class="space-y-6">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TitleType } from '../../../base/types/content'

defineProps({
  title: {
    type: Object as PropType<TitleType>,
    required: true,
  },
  alignment: {
    type: String,
    default: 'left',
  },
  isCta: {
    type: Boolean,
    default: false,
  },
  labelWhite: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped></style>
