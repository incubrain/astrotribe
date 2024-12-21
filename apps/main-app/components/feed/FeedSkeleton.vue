<template>
  <div
    class="mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:col-start-2 gap-4 md:gap-8 p-4 md:p-8 max-w-[940px]"
  >
    <NewsCardSkeleton
      v-for="n in 6"
      :key="`skeleton-${n}`"
    />
  </div>
</template>
