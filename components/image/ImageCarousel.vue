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
          class="flex flex-row text-sm w-full items-center"
        >
          <UAccordion :items="getImagInfo(image)" />
        </div>
      </div>
    </SwiperSlide>
    <div
      v-if="totalPage && totalPage > 1"
      class="custom-button-next hidden md:flex items-center w-12 justify-center h-full bg-black/30 absolute top-0 right-0 z-10 cursor-pointer"
    >
      <UIcon
        name="i-mdi-chevron-right"
        class="w-10 h-10 text-white"
      />
    </div>
    <div
      v-if="totalPage && totalPage > 1"
      class="custom-button-prev hidden md:flex items-center w-12 justify-center h-full bg-black/30 absolute top-0 left-0 z-10 cursor-pointer"
    >
      <UIcon
        name="i-mdi-chevron-left"
        class="w-10 h-10 text-white"
      />
    </div>
    <div
      v-if="totalPage && totalPage > 1"
      class="custom-pagination absolute top-2 left-2 z-10"
    >
      <p class="rounded-md bg-black/20 text-white text-sm"> {{ currentPage }}/{{ totalPage }} </p>
    </div>
  </Swiper>
</template>

<script setup lang="ts">
import { Media } from '@/types/news'
const getImagInfo = (image: Media) => [
  {
    label: 'Caption',
    icon: 'i-heroicons-information-circle',
    defaultOpen: true,
    content: image.caption!
  },
  {
    label: 'Credit',
    icon: 'i-heroicons-information-circle',
    defaultOpen: false,
    content: image.credit!
  }
]

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
