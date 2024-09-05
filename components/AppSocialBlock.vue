<template>
  <div class="flex flex-col">
    <h2
      v-if="hasTitle"
      class="text-xl font-semibold leading-normal lg:text-2xl"
    >
      Follow us
    </h2>
    <div :class="`mt-2 flex w-full gap-2 ${position}`">
      <a
        v-for="s in socials"
        :key="s.id"
        class="cursor-pointer"
        target="_blank"
        :href="s.url"
      >
        <Icon
          :name="`mdi:${s.platform}`"
          class="h-[24px] w-[24px]"
        />
      </a>
      <!-- !todo add social username -->
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserSocialType } from '@/types/users'

defineProps({
  socials: {
    type: Array as PropType<UserSocialType[]>,
    required: true
  },
  hasTitle: {
    type: Boolean,
    default: true
  },
  position: {
    type: String,
    required: false,
    default: 'justify-center'
  }
})
</script>

<style scoped></style>
