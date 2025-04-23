<script setup lang="ts">
const isOpen = ref(false)

const handleClicked = () => {
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
      alt: '',
    }),
  },
})
</script>

<template>
  <PrimeCard
    :pt="{
      body: 'py-2 px-1',
    }"
    :pt-options="{ mergeProps: true, mergeSections: true }"
  >
    <template #content>
      <PrimeButton
        class="relative flex items-center justify-center"
        link
        @click="handleClicked()"
      >
        <IBImage
          :img="{
            src: video.thumbnail,
            alt: video.alt,
            height: '480px',
            width: '840px',
            sizes: '100vw lg:50vw',
          }"
        />
        <Icon
          name="mdi:play"
          class="absolute"
          size="72px"
        />
      </PrimeButton>

      <PrimeDialog
        v-model:visible="isOpen"
        modal
        :closable="true"
        :dismissable-mask="true"
        :style="{ width: '60rem' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      >
        <template #header>
          <h2 class="text-2xl font-semibold"> Watch the video </h2>
        </template>
        <div class="relative flex aspect-[16/9] w-full max-w-[1140px]">
          <iframe
            :src="video.url"
            title="YouTube video player"
            frameborder="0"
            class="aspect-video w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
        </div>
      </PrimeDialog>
    </template>
  </PrimeCard>
</template>

<style></style>
