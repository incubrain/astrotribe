<template>
  <div
    id="lightgallery"
    class="flex items-center justify-center"
  >
    <a
      v-for="item in props.media"
      :key="item.id"
      data-lg-size="1280-720"
      :data-src="item.url"
      :data-poster="utils.assets.local(item.thumbnail)"
    >
      <div
        class="relative flex items-center justify-center w-full h-full p-4 rounded-lg foreground"
      >
        <img
          class="w-full h-full rounded-lg shadow-lg img-responsive aspect-auto"
          :src="utils.assets.local(item.thumbnail)"
        />
        <UIcon
          name="i-mdi-play"
          class="absolute w-[72px] h-[72px]"
        />
        <slot class="absolute bottom-0 left-0" />
      </div>
    </a>
  </div>
</template>

<script setup lang="ts">
import lightGallery from 'lightgallery'

// Plugins
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgZoom from 'lightgallery/plugins/zoom'
import lgVideo from 'lightgallery/plugins/video'

interface MediaItem {
  id: number
  url: string
  thumbnail: string
  alt: string
}

const utils = useUtils()

onMounted(() => {
  const lg = document.getElementById('lightgallery')!
  lightGallery(lg, {
    plugins: [lgZoom, lgThumbnail, lgVideo],
    speed: 500,
    autoplayFirstVideo: true,
    youTubePlayerParams: {
      modestbranding: 1,
      showinfo: 0,
      rel: 0,
      controls: 1
    }
  })
})

const props = defineProps({
  media: {
    type: [] as PropType<MediaItem[]>,
    required: true
  }
})

const onInit = () => {
  console.log('lightGallery has been initialized')
}

const onBeforeSlide = () => {
  console.log('calling before slide')
}
</script>

<style>
@import 'lightgallery/css/lightgallery.css';
@import 'lightgallery/css/lg-thumbnail.css';
@import 'lightgallery/css/lg-zoom.css';
@import 'lightgallery/css/lg-video.css';
</style>
