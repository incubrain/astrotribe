<script setup lang="ts">
// Banner visibility state
const hideAd = ref(false)
const { width } = useWindowSize()

// Show banner on desktop and when not explicitly hidden
const bannerVisible = computed(() => !hideAd.value || width.value > 768)

// Toggle banner visibility
const toggleBanner = () => {
  hideAd.value = !hideAd.value
}
</script>

<template>
  <div
    v-if="bannerVisible"
    class="wrapper py-4"
  >
    <BlogGlass
      gradient="mixed"
      intensity="low"
      glow-color="purple"
      class="relative"
    >
      <div class="flex flex-col md:flex-row items-center gap-4 p-4">
        <div class="flex-shrink-0">
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
        </div>

        <div class="flex-grow space-y-2 text-center md:text-left">
          <h3 class="text-xl font-semibold">Hi 👋, I'm Shweta</h3>
          <p class="text-sm">
            We're showcasing the amazing people and companies pushing astronomy and space
            exploration forward.
            <strong>If this sounds like you or someone you know, let's connect!</strong>
          </p>
        </div>

        <div class="flex-shrink-0">
          <NuxtLink
            to="mailto:connectus@astronera.org"
            aria-label="Reach out to Shweta via email"
            target="_blank"
          >
            <PrimeButton severity="secondary">Reach Out</PrimeButton>
          </NuxtLink>
        </div>
      </div>
    </BlogGlass>
  </div>
</template>
