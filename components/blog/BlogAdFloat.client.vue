<template>
  <div
    v-if="adVisible"
    class="fixed bottom-0 right-0 z-20 lg:sticky lg:top-24 w-full p-4 border border-primary-600 dark:border-primary-800 lg:rounded-md bg-primary-50 dark:bg-primary-950 flex flex-col gap-4 justify-between"
  >
    <div
      class="absolute lg:hidden -top-3 right-2 cursor-pointer rounded-full p-3 background border border-color flex justify-center items-center"
    >
      <UIcon
        name="i-mdi-close"
        class="absolute"
        @click="hideAd = true"
      />
    </div>
    <div class="flex justify-start items-center gap-2 flex-shrink-0">
      <div class="p-1 background rounded-full">
        <NuxtImg
          src="images/team/shweta-kulkarni.jpg"
          alt="Shweta Kulkarni is the CEO / Founder of AstronEra"
          width="60"
          height="60"
          class="rounded-full"
        />
      </div>
      <h3 class="text-2xl font-semibold"> Hi 👋, I'm Shweta </h3>
    </div>
    <div class="flex flex-col justify-start items-start gap-4 w-full">
      <p class="text-base">
        We're want to showcase the amazing people and companies pushing astronomy and space
        exploration forward.
      </p>
      <p class="text-base font-semibold pb-2">
        If this sounds like you or someone you know, let's connect!
      </p>
      <UButton
        to="mailto:shweta@astronera.org"
        :aria-label="`Reach out to Shweta on LinkedIn`"
        color="white"
        variant="solid"
        class="font-semibold px-8"
        target="_blank"
      >
        Reach Out
      </UButton>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const { width } = useWindowSize()
const hideAd = ref(false)
const adVisible = computed(() => !hideAd.value || width.value > 1024)
</script>

<style scoped></style>
