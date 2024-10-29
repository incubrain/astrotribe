<template>
  <LandingGlass
    v-if="adVisible"
    hover-effect="glow"
    glow-color="purple"
    gradient="mixed"
    intensity="low"
    interactive
    isolate-content
  >
    <div class="flex flex-shrink-0 items-center justify-start gap-2 p-2 pb-0">
      <div class="background rounded-full p-1">
        <IBImage
          :img="{
            src: 'images/team/shweta-kulkarni.jpg',
            alt: 'Shweta Kulkarni is the CEO / Founder of AstronEra',
            width: '60',
            height: '60',
          }"
          class="rounded-full"
        />
      </div>
      <h3 class="text-2xl font-semibold"> Hi 👋, I'm Shweta </h3>
    </div>
    <div
      class="background absolute -top-3 right-2 flex cursor-pointer items-center justify-center rounded-full p-3 lg:hidden"
    >
      <Icon
        name="mdi:close"
        class="absolute"
        @click="toggleAd"
      />
    </div>
    <div class="pt-8 space-y-8">
      <div class="flex w-full flex-col items-start justify-start gap-4">
        <span class="text-base">
          We're want to showcase the amazing people and companies pushing astronomy and space
          exploration forward.
          <strong> If this sounds like you or someone you know, let's connect! </strong>
        </span>
      </div>
      <div>
        <NuxtLink
          to="mailto:connectus@astronera.org"
          aria-label="Reach out to Shweta via email"
          target="_blank"
        >
          <PrimeButton severity="secondary"> Reach Out </PrimeButton>
        </NuxtLink>
      </div>
    </div>
  </LandingGlass>
</template>

<script setup lang="ts">
const { width } = useWindowSize()
const hideAd = ref(false)
const adVisible = computed(() => !hideAd.value || width.value > 1024)

const toggleAd = () => {
  hideAd.value = !hideAd.value
  console.log('hideAd', hideAd.value)
}
</script>

<style scoped></style>
