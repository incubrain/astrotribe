<template>
  <div>
    <UButton
      variant="link"
      class="relative flex items-center justify-center w-full h-full p-4 rounded-lg foreground"
      @click="isOpen = true"
    >
      <NuxtImg
        :src="video.thumbnail"
        :alt="video.alt"
        sizes="100vw lg:50vw"
      />
      <UIcon
        name="i-mdi-play"
        class="absolute w-[72px] h-[72px]"
      />
    </UButton>

    <UModal
      v-model="isOpen"
      :ui="{
        inner: 'fixed inset-0 flex w-full h-screen justify-center items-center',
        base: 'max-w-[1140px] h-auto w-full aspect-[16/9] flex justify-center items-center min-h-0',
        container: 'flex h-auto max-w-[1140px] w-full aspect-[16/9] items-center justify-center text-center',
      }"
    >
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
    </UModal>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false)

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
