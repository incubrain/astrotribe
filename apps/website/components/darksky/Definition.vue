<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
  description?: string[]
}>()

// Default description if none provided
const defaultDescription = [
  'Light pollution is the overuse of artificial light that disrupts ecosystems, harms human health, wastes energy, and hides the stars.',
  'As cities grow, unshielded lights create a sky glow that erases the night sky and our connection to it.',
  'Unlike other pollution, light pollution is instantly reversible—just by changing how we light our world.',
]
</script>

<template>
  <section class="relative py-16">
    <div class="wrapper">
      <LandingTitle
        :title="title || 'What Is Light Pollution?'"
        :subtitle="subtitle || 'Understanding the problem is the first step toward solving it'"
        class="mb-12"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Left Column: Text Content -->
        <div>
          <LandingGlass
            hover-effect="glow"
            glow-color="blue"
            gradient="blue"
            intensity="low"
            interactive
          >
            <div class="space-y-4">
              <p
                v-for="(paragraph, index) in description || defaultDescription"
                :key="index"
                class="text-xl"
              >
                {{ paragraph }}
              </p>
            </div>

            <div class="mt-6 flex justify-end">
              <PrimeButton
                size="small"
                severity="secondary"
                outlined
              >
                Learn More
                <Icon
                  name="mdi:arrow-right"
                  class="ml-2"
                />
              </PrimeButton>
            </div>
          </LandingGlass>
        </div>

        <!-- Right Column: Visual Representation -->
        <div class="h-full">
          <div>
            <div class="aspect-video relative p-2 rounded-xl overflow-hidden border border-color">
              <iframe
                src="https://player.vimeo.com/video/178841667?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                frameborder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"
                title="Lost in Light"
              ></iframe>
            </div>
            <PrimeMessage
              class="mt-8"
              severity="warn"
            >
              Over 80% of the world's population lives under light-polluted skies, limiting their
              view of stars and disconnecting them from the natural night environment.
            </PrimeMessage>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes twinkle {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}
</style>
