<template>
  <div class="background flex flex-col w-full">
    <NavTop class="min-h-[50px] lg:min-h-[60px]" />
    <AppBody class="w-full">
      <slot />
      <HomeFooter v-if="$route.path !== '/contact'" />
    </AppBody>
  </div>
</template>

<script setup lang="ts"></script>

<style></style>
