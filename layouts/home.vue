<template>
  <div class="bg-gray-100 dark:bg-neutral-950 flex flex-col w-full">
    <NavTop class="min-h-[50px] lg:min-h-[60px]" />
    <AppBody class="w-full">
      <slot />
      <HomeFooter />
    </AppBody>
  </div>
</template>

<script setup lang="ts"></script>

<style></style>
