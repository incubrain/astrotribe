<template>
  <div class="flex flex-col">
    <h2
      v-if="hasTitle"
      class="text-xl font-semibold leading-normal lg:text-2xl"
    >
      Follow us
    </h2>
    <div :class="`flex w-full gap-2 mt-2 ${position}`">
      <IconSocial
        v-for="s in socials"
        :key="s.id"
        :platform="s.platform"
        :link="s.url"
      />
      <!-- !todo add social username -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserSocial } from '@/types/users'

defineProps({
  socials: {
    type: Array as PropType<UserSocial[]>,
    required: true
  },
  hasTitle: {
    type: Boolean,
    default: true
  },
  position: {
    type: String,
    default: 'justify-center'
  }
})
</script>

<style scoped></style>
