<template>
  <div class="bg-gray-200 text-white flex flex-col w-full h-full">
    <div
      class="w-full h-full lg:grid-cols-[minmax(240px,10%)_minmax(600px,100%)] lg:grid"
    >
      <div
        class="lg:col-start-1 lg:col-span-2 w-full gap-4 md:gap-8 relative z-10"
      >
        <NavTop class="min-h-[50px] lg:min-h-[60px]" />
      </div>
      <div
        class="lg:col-start-1 lg:col-span-1 lg:row-start-2 lg:row-span-1 flex w-full h-full relative bg-[#E5E7EB]"
      >
        <NavSidebar class="left-0 sticky top-0" />
      </div>
      <div
        id="defaultLayout"
        class="lg:col-start-2 lg:col-span-1 lg:row-span-1 lg:row-start-2 w-full h-[calc(100vh-90px)] lg:h-[calc(100vh-60px)] overflow-y-scroll md:p-4 xl:p-8 relative"
      >
        <div class="max-w-[1600px] mx-auto">
          <slot />
        </div>
      </div>
      <NavMobi
        class="flex fixed bottom-0 left-0 w-full lg:hidden h-[40px] shadow-sm"
      />
    </div>
  </div>
</template>

<script setup></script>

<style>
/*
Layout transition animation
https://nuxt.com/docs/getting-started/transitions
*/
.layout-enter-active,
.layout-leave-active {
  transition: all 0.4s;
}

.layout-enter-from,
.layout-leave-to {
  opacity: 0;
  filter: blur(1rem);
}

.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
