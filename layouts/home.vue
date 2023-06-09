<template>
  <div class="bg-gray-100 dark:bg-neutral-950 flex flex-col w-full h-full">
    <div class="w-full sticky top-0 left-0 gap-4 md:gap-8 z-50">
      <NavTop class="min-h-[50px] lg:min-h-[60px]" />
    </div>
    <AppBody class="w-full">
      <slot />
      <HomeFooter />
    </AppBody>
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
</template>

<script setup lang="ts"></script>

<style></style>
