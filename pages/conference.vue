<template>
  <div>
    <ImageHero
      :img="conference.hero.img"
      :title="conference.hero.title"
      subtitle="24th-26th November 2023"
      object-position="object-top"
    />
    <div class="flex flex-col max-w-6xl gap-12 p-4 mx-auto xl:gap-24 xl:py-24">
      <h2 class="text-3xl font-bold leading-7 text-center xl:text-4xl xl:leading-9 pt-6 xl:pt-0">
        Help us preserve the night skies
      </h2>
      <div class="grid items-start grid-cols-1 gap-8 lg:grid-cols-2">
        <div class="w-full grid grid-cols-2 gap-4 xl:gap-8 xl:w-10/12">
          <div
            v-for="(image, index) in conference.images"
            :key="index"
            class="rounded-md overflow-hidden"
          >
            <NuxtImg
              :src="image.src"
              :alt="image.alt"
            />
          </div>
        </div>
        <div class="w-full leading-6 text-left xl:w-10/12">
          <h3 class="pb-4 text-2xl font-bold leading-7"> What is it? </h3>
          <p class="pb-3 text-base font-normal">
            {{ conference.about }}
          </p>
        </div>
      </div>
      <NuxtImg
        class="rounded-md"
        src="images/shweta-kulkarni-painting-common-man-looking-at-universe.jpg"
        alt="Poster for the 2023 Dark Sky Conservation India Conference"
      />
      <ConferenceSpeakers :speakers="conference.speakers" />
      <HomeCtaSecond
        title="some title"
        body="join us if you are awesome"
        cta="Apply to become a speaker"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const conference = {
  hero: {
    title: 'Dark Sky Conservation India Conference',
    subtitle: '',
    img: {
      title: 'Featured image for the Dark Sky Conservation India Conference',
      src: 'images/shweta-kulkarni-painting-common-man-looking-at-universe.jpg',
      alt: 'Featured image for the Dark Sky Conservation India Conference'
    }
  },
  about: 'some information about the conference',
  images: [
    {
      title: 'Featured image for the Dark Sky Conservation India Conference',
      src: 'images/shweta-kulkarni-painting-common-man-looking-at-universe.jpg',
      alt: 'Featured image for the Dark Sky Conservation India Conference'
    },
    {
      title: 'Featured image for the Dark Sky Conservation India Conference',
      src: 'images/shweta-kulkarni-painting-common-man-looking-at-universe.jpg',
      alt: 'Featured image for the Dark Sky Conservation India Conference'
    },
    {
      title: 'Featured image for the Dark Sky Conservation India Conference',
      src: 'images/shweta-kulkarni-painting-common-man-looking-at-universe.jpg',
      alt: 'Featured image for the Dark Sky Conservation India Conference'
    },
    {
      title: 'Featured image for the Dark Sky Conservation India Conference',
      src: 'images/shweta-kulkarni-painting-common-man-looking-at-universe.jpg',
      alt: 'Featured image for the Dark Sky Conservation India Conference'
    }
  ],
  schedule: {
    day1: {
      title: '',
      about: ''
    }
  },
  speakers: [
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
  ]
}

definePageMeta({
  name: 'Conference',
  layout: 'home'
})
</script>
