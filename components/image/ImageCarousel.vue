<template>
  <Swiper
    :modules="[SwiperNavigation, SwiperPagination]"
    :loop="true"
    :navigation="{
      nextEl: '.custom-button-next',
      prevEl: '.custom-button-prev'
    }"
    @slide-change="onSlideChange"
  >
    <SwiperSlide
      v-for="image in p.media"
      :key="image.src"
    >
      <div class="flex flex-col">
        <NuxtImg
          :src="image.src"
          :alt="image.alt ? image.alt : 'no alt message'"
          class="w-full h-full object-contain object-top"
          :width="p.imgOptions?.width"
          :height="p.imgOptions?.height"
          :quality="p.imgOptions?.quality"
          loading="lazy"
        />
        <div
          v-if="image.caption || image.credit"
          class="flex flex-col lg:hidden gap-2 px-4 pt-4 lg:px-14 foreground text-sm"
        >
          <p v-if="image.caption">{{ image.caption }}</p>
          <p v-if="image.credit"> Credit: {{ image.credit }} </p>
        </div>
      </div>
    </SwiperSlide>
    <div
      class="custom-button-next hidden md:flex items-center w-12 justify-center h-full bg-black/30 absolute top-0 right-0 z-10 cursor-pointer"
    >
      <UIcon
        name="i-mdi-chevron-right"
        class="w-10 h-10 text-white"
      />
    </div>
    <div
      class="custom-button-prev hidden md:flex items-center w-12 justify-center h-full bg-black/30 absolute top-0 left-0 z-10 cursor-pointer"
    >
      <UIcon
        name="i-mdi-chevron-left"
        class="w-10 h-10 text-white"
      />
    </div>
    <div class="custom-pagination absolute top-2 left-2 z-10">
      <p class="rounded-md bg-black/20 text-white text-sm"> {{ currentPage }}/{{ totalPage }} </p>
    </div>
  </Swiper>
</template>

<script setup lang="ts">
// const items = [
//   {
//     label: 'Getting Started',
//     icon: 'i-heroicons-information-circle',
//     defaultOpen: true,
//     content:
//       'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
//   },
//   {
//     label: 'Installation',
//     icon: 'i-heroicons-arrow-down-tray',
//     disabled: true,
//     content:
//       'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
//   }
// ]

interface Media {
  src: string
  alt: string | null
  caption: string | null
  credit: string | null
}

interface ImgOptions {
  width: number
  height: number
  sizes: string | undefined | null
  quality: number | undefined
}

const p = defineProps({
  media: {
    type: Array as () => Media[] | undefined,
    required: true
  },
  imgOptions: {
    type: Object as () => ImgOptions | undefined,
    default: () => ({
      width: 800,
      height: 460,
      sizes: null,
      quality: 80
    })
  }
})

const totalPage = ref(computed(() => p.media?.length))
const currentPage = ref(1)

function onSlideChange(s: any) {
  currentPage.value = s.realIndex + 1
}
</script>

<style></style>
