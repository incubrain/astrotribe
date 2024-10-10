<template>
  <div class="flex flex-col space-y-2">
    <h2
      v-if="hasTitle"
      class="text-xl font-semibold leading-normal"
    >
      Follow us
    </h2>
    <div :class="`flex w-full gap-2 ${position}`">
      <a
        v-for="s in socials"
        :key="s.id"
        class="cursor-pointer"
        target="_blank"
        :href="s.url"
      >
        <Icon
          :name="`mdi:${s.platform}`"
          :size="`${iconSize}px`"
        />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserSocialType } from '#types/users'

defineProps({
  socials: {
    type: Array as PropType<UserSocialType[]>,
    required: true,
  },
  hasTitle: {
    type: Boolean,
    default: true,
  },
  position: {
    type: String,
    required: false,
    default: 'justify-center',
  },
  iconSize: {
    type: Number,
    default: 24,
  },
})
</script>

<style scoped></style>
