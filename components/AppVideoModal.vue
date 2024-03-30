<template>
  <div>
    <PrimeButton
      variant="link"
      class="relative flex items-center justify-center w-full h-full p-4 rounded-lg foreground"
      @click="handleClicked($posthog)"
    >
      <NuxtImg
        :src="video.thumbnail"
        :alt="video.alt"
        height="480px"
        width="840px"
        sizes="100vw lg:50vw"
      />
      <Icon
        name="mdi:play"
        class="absolute w-[72px] h-[72px]"
      />
    </PrimeButton>

    <PrimeDialog
      v-model:visible="isOpen"
      modal
      :style="{ width: '60rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <template #header>
        <h2 class="font-semibold text-2xl">Watch the video</h2>
      </template>
      <div class="relative max-w-[1140px] w-full aspect-[16/9] flex">
        <iframe
          :src="video.url"
          title="YouTube video player"
          frameborder="0"
          class="w-full aspect-video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </PrimeDialog>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false)

const handleClicked = (posthog) => {
  posthog().capture('interest_video', { location: 'hero' })
  isOpen.value = true
}

type VideoType = {
  url: string
  thumbnail: string
  alt: string
}

defineProps({
  video: {
    type: Object as PropType<VideoType>,
    default: () => ({
      url: '',
      thumbnail: '',
      alt: ''
    })
  }
})
</script>

<style></style>
