<template>
  <div class="bg-gray-100 dark:bg-neutral-950 flex flex-col w-full h-full">
    <div class="w-full sticky top-0 left-0 gap-4 md:gap-8 z-50">
      <NavTop class="min-h-[50px] lg:min-h-[60px]" />
    </div>
    <AppBody class="w-full">
      <slot />
      <HomeFooter />
    </AppBody>
  </div>
</template>

<script setup lang="ts"></script>

<style></style>
