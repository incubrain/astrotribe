<template>
  <div class="flex justify-start items-center w-full gap-2 py-12">
    <p>Share</p>
    <PrimeButton
      v-for="platform in socialPlatforms"
      :key="platform.name"
      :to="platform.url"
      :aria-label="`Share article on ${platform.name}`"
      target="_blank"
      class="p-2"
    >
      <Icon
        :name="platform.icon"
        class="h-5 w-5 inline-block"
      />
    </PrimeButton>
    <p class="px-2">- or -</p>
    <PrimeButton
      :to="`https://github.com/incubrain/incubrain/edit/main/${link}`"
      target="_blank"
      class="flex items-center justify-center"
    >
      <Icon
        name="mdi:github"
        class="h-4 w-4 inline-block shrink-0"
      />
      Suggest Edit
    </PrimeButton>
  </div>
</template>

<script setup lang="ts">
const p = defineProps({
  shareText: {
    type: String,
    default: 'Check out this article!'
  },
  summary: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    required: true
  }
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
        url: `https://twitter.com/intent/tweet?url=${currentUrl.value}&text=${shareTextEncoded.value}`
      },
      {
        name: 'Email',
        icon: 'mdi:email',
        url: `mailto:?subject=${shareTextEncoded.value}&body=${currentUrl.value}`
      }
    ]
  }
})
const shareTextEncoded = computed(() => encodeURIComponent(p.shareText))
</script>

<style scoped></style>
