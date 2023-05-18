<template>
  <div class="bg-gray-200 text-white flex flex-col w-full h-full">
    <div class="w-full h-full">
      <div class="w-full gap-4 md:gap-8 relative z-10">
        <NavTop class="min-h-[50px] lg:min-h-[60px]" />
      </div>
      <div class="w-full h-[calc(100vh-50px)] lg:h-[calc(100vh-60px)] relative overflow-y-scroll">
        <slot />
        <HomeFooter />
      </div>
      <!-- <NuxtErrorBoundary @error="someErrorLogger">
                    You use the default slot to render your content
                    <template #error="{ error }">
                        You can display the error locally here.
                        <button @click="error = null">
                            This will clear the error.
                        </button>
                    </template>
                </NuxtErrorBoundary> -->
      <!-- <Footer /> -->
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style>

</style>
