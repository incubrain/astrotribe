<template>
  <div class="w-full">
    <h2 class="text-2xl font-semibold py-6">Speakers</h2>
    <Swiper
      v-if="speakers.length > 0"
      :modules="[SwiperGrid, SwiperAutoplay]"
      :autoplay="{
        delay: 5000
      }"
      :breakpoints="{
        640: {
          slidesPerView: 1,
          grid: {
            rows: 1,
            fill: 'row'
          }
        },
        768: {
          slidesPerView: 2,
          grid: {
            rows: 1,
            fill: 'row'
          }
        },
        1024: {
          slidesPerView: 3,
          grid: {
            rows: 1,
            fill: 'row'
          }
        }
      }"
      :space-between="40"
      class="pb-10"
    >
      <SwiperSlide
        v-for="(speaker, index) in speakers"
        :key="index"
      >
        <div class="p-6 foreground">
          <div class="flex items-center h-auto">
            <NuxtImg
              :src="speaker.avatar"
              :alt="`${speaker.name} will be presenting at the Dark Sky Conservation India Conference`"
              width="60px"
              height="60px"
              loading="lazy"
              quality="80"
              format="webp"
              class="rounded-full w-14 h-14"
            />
            <div class="flex flex-col items-start pl-4">
              <h3 class="text-2xl font-semibold">
                {{ speaker.name }}
              </h3>
              <p class="text-sm">
                {{ speaker.company }}
              </p>
            </div>
          </div>
          <p class="h-auto mt-8 text-sm italic">
            {{ speaker.about }}
          </p>
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup lang="ts">
interface Speaker {
  id: number
  name: string
  avatar: string
  company: string
  expertise: string
  about: string
}

const speakers = [
  {
    id: 1,
    name: 'first person',
    avatar: 'images/team/drew-macgibbon.jpg',
    expertise: 'My title',
    company: 'Incubrain',
    about:
      'I am the best person in the world and this is some information abour what I will be talking about'
  },
  {
    id: 2,
    name: 'second person',
    avatar: 'images/team/drew-macgibbon.jpg',
    expertise: 'My title',
    company: 'Incubrain',
    about:
      'I am the best person in the world and this is some information abour what I will be talking about'
  },
  {
    id: 3,
    name: 'third person',
    avatar: 'images/team/drew-macgibbon.jpg',
    expertise: 'My title',
    company: 'Incubrain',
    about:
      'I am the best person in the world and this is some information abour what I will be talking about'
  }
] as Speaker[]
</script>

<style scoped></style>
