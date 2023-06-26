<template>
  <div class="flex flex-col gap-2">
    <h1 class="pb-4 text-lg font-semibold md:text-xl xl:text-2xl">
      Connect
    </h1>
    <div class="flex flex-col gap-2 sm:flex-row md:gap-4">
      <a
        v-for="social in socials"
        :key="social.id"
        :href="social.url"
        class="flex justify-center w-full cursor-pointer"
      >
        <span class="flex flex-wrap items-center w-full gap-2 p-2 rounded-lg background">
          <UIcon
            :name="socialIcon(social.platform)"
            class="mr-1 w-7 h-7"
          />
          {{ util.strings.firstUpper(social.platform) }}
        </span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserSocial } from '@/types'

defineProps({
  socials: {
    type: Array as PropType<UserSocial[]>,
    required: true
  }
})

const socialIcon = (icon: string): string => {
  let iconName: string

  switch (icon) {
    case 'facebook':
      iconName = 'i-mdi-facebook'
      break
    case 'twitter':
      iconName = 'i-mdi-twitter'
      break
    case 'instagram':
      iconName = 'i-mdi-instagram'
      break
    case 'linkedin':
      iconName = 'i-mdi-linkedin'
      break
    case 'snapchat':
      iconName = 'i-mdi-snapchat'
      break
    case 'tiktok':
      iconName = 'i-mdi-tiktok'
      break
    case 'youtube':
      iconName = 'i-mdi-youtube'
      break
    case 'pinterest':
      iconName = 'i-mdi-pinterest'
      break
    case 'reddit':
      iconName = 'reddit'
      break
    default:
      throw new Error('Invalid social media name')
  }
  return iconName
}

const util = useUtils()
</script>

<style scoped></style>
