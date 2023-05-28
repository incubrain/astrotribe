<template>
  <div class="flex justify-center items-center flex-col py-12 px-4 md:px-6">
    <div class="flex justify-center items-center flex-col space-y-4">
      <h1 class="text-3xl xl:text-4xl font-extrabold leading-8 xl:leading-9"> Our Team </h1>
      <p class="w-11/12 text-base leading-normal text-center">
        It is a long established fact that a reader will be distracted by the readable content of a
        page when looking at its layout.
      </p>
    </div>
    <div
      class="mt-6 md:mt-10 xl:mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-y-12 md:gap-y-14 md:gap-x-24 xl:gap-y-0 lg:gap-x-14"
    >
      <div
        v-for="member in team"
        :key="member.name"
        class="flex flex-col items-center justify-center space-y-4"
      >
        <div class="w-24 border rounded-full">
          <img
            :src="member.avatar"
            :alt="member.name"
          />
        </div>
        <div class="flex flex-col justify-center items-center space-y-2">
          <p class="text-base font-semibold leading-none text-center">
            {{ member.name }}
          </p>
          <p class="text-sm leading-none text-center">
            {{ member.role }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const team = [
  {
    name: 'Drew MacGibbon',
    role: 'Head, Product Design',
    avatar: 'https://tuk-cdn.s3.amazonaws.com/can-uploader/team_7_img-1.png'
  }
  // ... other team members
]
</script>

<style scoped></style>
