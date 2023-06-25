<template>
  <div
    class="flex flex-col gap-8 bg-zinc-200 dark:bg-zinc-300 rounded-[0_0_.5rem_.5rem] px-4 md:px-8 pb-8 pt-4 md:pt-8 md:pb-12"
  >
    <h4 class="block gap-4 text-lg font-bold text-center uppercase text-zinc-800">
      Supported by
    </h4>
    <div class="grid justify-around w-full grid-cols-2 gap-4 md:grid-cols-4 md:justify-around">
      <NuxtImg
        src="images/trusted/dst.png"
        class="h-16 mx-auto lg:h-20 md:ml-0"
      />
      <NuxtImg
        src="images/trusted/iau-oad.png"
        class="h-16 mx-auto lg:h-20"
      />
      <NuxtImg
        src="images/trusted/in-fed.png"
        class="h-16 mx-auto lg:h-20"
      />
      <NuxtImg
        src="images/trusted/iimb-nsrcel.png"
        class="h-16 mx-auto lg:h-20 md:mr-0"
      />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
