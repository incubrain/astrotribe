<template>
  <div class="flex flex-col gap-12">
    <div class="flex flex-col space-y-4">
      <h3 class="text-2xl font-bold leading-7"> AstronEra Team </h3>
      <p class="max-w-sm text-base leading-normal">
        AstronEra thrives thanks to its dedicated team. Passionate about astronomy and education?
      </p>
      <p class="max-w-md text-base leading-normal">
        <strong> Contact Shweta or Mac to join us.</strong> <br />
        Together, we'll explore the universe!
      </p>
    </div>
    <div
      class="grid w-full grid-cols-1 gap-6 mt-6 md:grid-cols-3 lg:grid-cols-4 md:gap-8 lg:gap-12"
    >
      <div
        v-for="member in team"
        :key="member.id"
        class="flex flex-col items-center justify-between w-full p-4 space-y-4 rounded-md shadow-md bg-[#8063e6] dark:bg-[#2f1352] backdrop-filter backdrop-blur-lg hadow-xl ring-1 ring-gray-900/5 dark:ring-[#2F1352]/50 transition-all duration-300 hover:-translate-y-1 hover:drop-shadow-2xl cursor-pointer"
      >
        <!-- SemiCircle -->
        <svg
          class="fixed bottom-1 left-0 mb-11 invisible md:visible"
          viewBox="0 0 375 283"
          fill="#ffffff"
          style="transform: scale(1.5); opacity: 0.1; filter: blur(2px)"
        >
          <rect
            x="0"
            y="205"
            width="220"
            height="220"
            rx="155"
            transform="rotate(-45 160 225)"
            fill="#ffffff"
          />
        </svg>
        <!-- Stars -->
        <div class="animate-pulse">
          <svg
            class="fixed bottom-46 left-12 mb-8 -z-10"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
          >
            <path
              fill="#b3b3b3"
              d="m14.43 10l-1.47-4.84c-.29-.95-1.63-.95-1.91 0L9.57 10H5.12c-.97 0-1.37 1.25-.58 1.81l3.64 2.6l-1.43 4.61c-.29.93.79 1.68 1.56 1.09l3.69-2.8l3.69 2.81c.77.59 1.85-.16 1.56-1.09l-1.43-4.61l3.64-2.6c.79-.57.39-1.81-.58-1.81h-4.45z"
            />
          </svg>
          <svg
            class="fixed bottom-22 left-36 mb-8 -z-10"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
          >
            <path
              fill="#b3b3b3"
              d="m14.43 10l-1.47-4.84c-.29-.95-1.63-.95-1.91 0L9.57 10H5.12c-.97 0-1.37 1.25-.58 1.81l3.64 2.6l-1.43 4.61c-.29.93.79 1.68 1.56 1.09l3.69-2.8l3.69 2.81c.77.59 1.85-.16 1.56-1.09l-1.43-4.61l3.64-2.6c.79-.57.39-1.81-.58-1.81h-4.45z"
            />
          </svg>
          <svg
            class="fixed top-28 right-14 mb-8 -z-10"
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 24 24"
          >
            <path
              fill="#b3b3b3"
              d="m14.43 10l-1.47-4.84c-.29-.95-1.63-.95-1.91 0L9.57 10H5.12c-.97 0-1.37 1.25-.58 1.81l3.64 2.6l-1.43 4.61c-.29.93.79 1.68 1.56 1.09l3.69-2.8l3.69 2.81c.77.59 1.85-.16 1.56-1.09l-1.43-4.61l3.64-2.6c.79-.57.39-1.81-.58-1.81h-4.45z"
            />
          </svg>
          <svg
            class="fixed top-52 left-12 mb-8 -z-10"
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 24 24"
          >
            <path
              fill="#b3b3b3"
              d="m14.43 10l-1.47-4.84c-.29-.95-1.63-.95-1.91 0L9.57 10H5.12c-.97 0-1.37 1.25-.58 1.81l3.64 2.6l-1.43 4.61c-.29.93.79 1.68 1.56 1.09l3.69-2.8l3.69 2.81c.77.59 1.85-.16 1.56-1.09l-1.43-4.61l3.64-2.6c.79-.57.39-1.81-.58-1.81h-4.45z"
            />
          </svg>
          <svg
            class="fixed bottom-12 left-44 -z-10"
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 24 24"
          >
            <path
              fill="#b3b3b3"
              d="m14.43 10l-1.47-4.84c-.29-.95-1.63-.95-1.91 0L9.57 10H5.12c-.97 0-1.37 1.25-.58 1.81l3.64 2.6l-1.43 4.61c-.29.93.79 1.68 1.56 1.09l3.69-2.8l3.69 2.81c.77.59 1.85-.16 1.56-1.09l-1.43-4.61l3.64-2.6c.79-.57.39-1.81-.58-1.81h-4.45z"
            />
          </svg>
        </div>
        <div class="relative pt-10 px-10 flex items-center justify-center">
          <div
            class="block absolute w-32 h-32 bottom-10 -mb-14 -z-10"
            style="
              background: radial-gradient(rgb(219, 219, 223), transparent 80%);
              border-radius: 100%;
              opacity: 0.5;
              filter: blur(5px);
            "
          >
          </div>
          <div class="w-20 overflow-hidden border rounded-full md:w-24">
            <NuxtImg
              :src="member.avatar"
              loading="lazy"
              :alt="member.name"
            />
          </div>
        </div>
        <div class="flex flex-col items-center justify-center space-y-5">
          <p
            class="text-black dark:text-gray-300 text-base font-semibold leading-none text-center rounded-sm"
          >
            {{ member.name }}
          </p>
          <p class="text-sm font-semibold leading-none text-center dark:text-gray-400">
            {{ member.position.title }}
          </p>
          <NuxtLink :to="`/team/${member.id}`" class="flex flex-col items-center justify-center font-semibold z-50">
            View Profile
          </NuxtLink>
          <SocialBlock
            :socials="member.socials"
            :has-title="false"
            class="flex items-center justify-center space-x-2"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import team from '@/data/home/team.json'
</script>

<style scoped></style>
