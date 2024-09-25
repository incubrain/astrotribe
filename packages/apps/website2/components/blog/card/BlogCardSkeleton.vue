<template>
  <div
    class="relative w-full h-full md:rounded-md border border-color cursor-pointer p-4 gap-4 flex flex-col overflow-hidden background"
  >
    <!-- BlogCatTag Skeleton -->
    <div class="flex gap-2 w-full mb-4 flex-wrap">
      <div class="w-24 h-5 foreground rounded mb-2" />
      <!-- Category Badge -->
      <div class="w-16 h-5 foreground rounded mb-2" />
      <!-- Tag Badge 1 -->
      <div class="w-20 h-5 foreground rounded mb-2" />
      <!-- Tag Badge 2 -->
    </div>

    <!-- NuxtImg Skeleton -->
    <div class="rounded-md w-full h-48 foreground mb-4" />

    <div class="flex flex-col gap-2 items-start w-full p-2 xl:p-4 justify-center">
      <!-- article.title Skeleton -->
      <div class="h-6 w-3/4 foreground mb-2 rounded" />

      <!-- BlogAuthor Skeleton -->
      <div class="flex flex-row gap-2 lg:gap-3 justify-center items-center">
        <div class="w-32 h-5 foreground rounded" />
        <!-- Author Name 1 -->
        <div class="w-16 h-5 foreground rounded ml-2" />
        <!-- Date -->
      </div>

      <!-- article.description Skeleton -->
      <div class="h-5 w-full foreground rounded mt-2" />
    </div>
  </div>
</template>

<script lang="ts" setup></script>
