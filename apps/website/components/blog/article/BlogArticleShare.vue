<template>
  <div class="flex w-full items-center justify-start gap-2 py-12">
    <p>Share</p>
    <PrimeButton
      v-for="platform in socialPlatforms"
      :key="platform.name"
      as="a"
      :href="platform.url"
      :aria-label="`Share article on ${platform.name}`"
      target="_blank"
      class="p-2"
    >
      <Icon
        :name="platform.icon"
        class="inline-block"
        size="24px"
      />
    </PrimeButton>
  </div>
</template>

<script setup lang="ts">
const p = defineProps({
  shareText: {
    type: String,
    default: 'Check out this article!',
  },
  summary: {
    type: String,
    default: '',
  },
  link: {
    type: String,
    required: true,
  },
})

const currentUrl = ref()
const socialPlatforms = ref([] as any[])
onMounted(() => {
  if (window) {
    currentUrl.value = encodeURIComponent(window.location.href)
    socialPlatforms.value = [
      {
        name: 'Twitter',
        icon: 'mdi:twitter',
        url: `https://twitter.com/intent/tweet?url=${currentUrl.value}&text=${shareTextEncoded.value}`,
      },
      {
        name: 'Email',
        icon: 'mdi:email',
        url: `mailto:?subject=${shareTextEncoded.value}&body=${currentUrl.value}`,
      },
    ]
  }
})
const shareTextEncoded = computed(() => encodeURIComponent(p.shareText))
</script>

<style scoped></style>
