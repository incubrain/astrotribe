<template>
  <div class="relative w-full h-[100vh] flex flex-row gap-4 md:gap-10 lg:gap-20 py-home px-home">
    <div
      :style="{ backgroundImage: `url('${bgImg}')` }"
      class="absolute w-full h-full top-0 left-0 bg-cover bg-center bg-no-repeat"
    ></div>
    <!-- Hero Left -->
    <div class="relative z-50 w-full h-full flex flex-col gap-4">
      <div class="w-24 h-24 aspect-square rounded-full shadow-lg p-4 bg-white">
        <img
          src="/astronera-logo.jpg"
          class=""
        />
      </div>
      <h1 class="head-1 leading-none pt-4 max-w-md">This is the main title</h1>
      <p class="text-xl font-semibold max-w-sm"
        >Convincing people to sign up to the product in just 2 lines</p
      >
      <div class="pt-4">
        <HomeButton
          cta="Join Free"
          :variant="true"
        />
      </div>
    </div>
    <!-- Hero Right -->
    <div class="relative z-50 bg-blue-200 w-full h-full">
      <p>Right Side</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const bgImg = '/cover1.jpg'
</script>
