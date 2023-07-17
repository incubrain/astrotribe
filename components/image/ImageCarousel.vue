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
          <UPopover
            v-if="image.caption"
            :popper="{ placement: 'bottom-start' }"
            class="p-2 w-1/2"
          >
            <UButton
              block
              color="white"
              label="Caption"
              trailing-icon="i-heroicons-chevron-down-20-solid"
            />

            <template #panel>
              <p class="p-2 w-64 z-50">{{ image.caption }}</p>
            </template>
          </UPopover>
          <UPopover
            v-if="image.credit"
            :popper="{ placement: 'bottom-start' }"
            class="w-1/2"
          >
            <UButton
              block
              color="white"
              label="Credit"
              trailing-icon="i-heroicons-chevron-down-20-solid"
            />

            <template #panel>
              <p class="p-2 w-64 z-50"> Credit: {{ image.credit }} </p>
            </template>
          </UPopover>
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
import { Media } from '@/types/zod/news'
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
