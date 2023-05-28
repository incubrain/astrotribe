<template>
  <div class="max-w-[1240px] mx-auto flex flex-col gap-32">
    <div class="2xl:mx-auto lg:py-16 lg:px-20 md:py-12 md:px-6 py-9 px-4">
      <div class="relative">
        <div
          class="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center sm:px-12 px-6 rounded-md"
        >
          <h2 class="font-bold lg:text-4xl text-3xl lg:leading-9 leading-7 text-white"> Discover about us </h2>
          <img
            class="mt-8 cursor-pointer hover:bg-gray-200 hover:bg-opacity-20 rounded-md"
            src="https://tuk-cdn.s3.amazonaws.com/can-uploader/about-us-5-svg1.svg"
            alt="play"
          />
        </div>
        <div>
          <img
            v-for="img in images"
            :key="img.id"
            :class="img.class"
            :src="img.src"
            alt="A person Coding"
          />
        </div>
      </div>

      <div class="lg:mt-14 sm:mt-7 mt-14">
        <div class="flex lg:flex-row flex-col items-center">
          <div class="w-full lg:w-7/12">
            <h2
              class="font-bold lg:text-4xl text-3xl lg:leading-9 leading-7 text-left"
            >
              Our Story
            </h2>
            <p
              v-for="paragraph in paragraphs"
              :key="paragraph.id"
              class="pr-6 font-normal text-base leading-6 mt-6 w-full xl:w-9/12 text-left"
            >
              {{ paragraph.text }}
            </p>
          </div>

          <div class="lg:pt-16 xl:pt-0 w-full lg:w-5/12 lg:mt-0 sm:mt-10 mt-8">
            <div class="w-full grid sm:grid-cols-2 grid-cols-1">
              <AboutDetailCard />
            </div>
          </div>
        </div>
      </div>
    </div>

    <AboutTeam />
  </div>
</template>

<script setup lang="ts">

definePageMeta({
  name: 'About',
  layout: 'home'
})

const images = ref([
  { id: 1, class: 'rounded-md lg:block hidden w-full', src: 'https://i.ibb.co/17q26WL/qw.png' },
  {
    id: 2,
    class: 'rounded-md lg:hidden sm:block hidden w-full',
    src: 'https://i.ibb.co/pZX8cKM/Rectangle-122-1.png'
  },
  {
    id: 3,
    class: 'rounded-md sm:hidden block w-full',
    src: 'https://i.ibb.co/b3YLqxC/Rectangle-122.png'
  }
])

const paragraphs = ref([
  { id: 1, text: `It is a long established fact that a reader will be distracted by the readable content
              of a page when looking at its layout. The point of using Lorem Ipsum.In the first
              place we have granted to God, and by this our present charter confirmed for us and our
              heirs forever that the English Church shall be free, and shall have her rights entire,
              and her liberties inviolate; and we will that it be thus observed; which is apparent
              from` },
  { id: 2, text: `It is a long established fact that a reader will be distracted by the readable content
              of a page when looking at its layout. The point of using Lorem Ipsum.In the first
              place we have granted to God, and by this our present charter confirmed for us and our
              heirs forever that the English Church shall be free, and shall have her rights entire,
              and her liberties inviolate; and we will that it be thus observed; which is apparent
              from` }
])

</script>
