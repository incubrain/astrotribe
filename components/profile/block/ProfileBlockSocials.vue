<template>
  <div class="flex flex-col gap-2">
    <h1 class="text-lg font-semibold md:text-xl xl:text-2xl pb-4 font-semibold"> Connect </h1>
    <div class="flex flex-col sm:flex-row gap-2 md:gap-4">
      <a
        v-for="social in socials"
        :key="social.id"
        :href="social.url"
        class="flex justify-center w-full"
      >
        <span class="flex flex-wrap gap-2 items-center bg-blue-50 rounded-lg p-2 w-full">
          <UIcon
            :name="`i-mdi-${social.platform}`"
            class="mr-1 w-7 h-7"
          />
          {{ util.strings.firstUpper(social.platform) }}
        </span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Socials } from '@/types'

defineProps({
  socials: {
    type: Array as PropType<Socials[]>,
    required: true
  }
})

const util = useUtils()
</script>

<style scoped></style>
