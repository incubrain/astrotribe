<template>
  <div
    v-if="formattedSocials.length > 0"
    class="flex gap-2"
  >
    <a
      v-for="social in formattedSocials"
      :key="`${social.platform}-icon`"
      class="cursor-pointer"
      target="_blank"
      :href="social.url"
    >
      <Icon
        :name="social.icon"
        class="h-[24px] w-[24px]"
      />
    </a>
  </div>
</template>

<script setup lang="ts">
interface Socials {
  [key: string]: string
}

const props = defineProps({
  socials: {
    type: Object as PropType<Socials>,
    required: true
  }
})

const socialIcon = (platform: string) => {
  switch (platform) {
    case 'linkedin':
      return 'mdi:linkedin'
    case 'youtube':
      return 'mdi:youtube'
    case 'instagram':
      return 'mdi:instagram'
    case 'facebook':
      return 'mdi:facebook'
    case 'twitter':
      return 'mdi:twitter'
    default:
      return ''
  }
}

const formattedSocials = computed(() => {
  if (!props.socials) return []
  return Object.entries(props.socials).map(([platform, url]) => {
    return {
      platform: platform.split('_')[0],
      url,
      icon: socialIcon(platform.split('_')[0])
    }
  })
})
</script>

<style scoped></style>
