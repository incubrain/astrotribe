<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
  description?: string[]
}>()

// Default description if none provided
const defaultDescription = [
  'Light pollution is excessive, misdirected, or obtrusive artificial light produced by human activities.',
  'This phenomenon disrupts ecosystems, affects human health by interfering with circadian rhythms, wastes energy, and obscures our view of the stars.',
  'As urbanization expands, the glow of unshielded lights creates a sky glow that hides celestial objects and natural darkness, disconnecting us from the night sky.',
  'Unlike other forms of pollution, light pollution is immediately reversible by implementing proper lighting practices and reducing unnecessary illumination.',
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
                class="text-base"
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
          <LandingGlass
            hover-effect="glow"
            glow-color="purple"
            gradient="mixed"
            intensity="low"
            class="h-full"
            interactive
            :padded="false"
          >
            <div class="relative w-full aspect-video overflow-hidden rounded-lg">
              <!-- Before/After Comparison -->
              <div class="relative w-full h-full">
                <!-- Good Sky - Natural Night -->
                <div class="absolute inset-0">
                  <IBImage
                    :img="{
                      src: '/images/darksky/natural-night-sky.jpg',
                      alt: 'Natural night sky with stars',
                      width: 600,
                      height: 400,
                    }"
                    class="object-cover w-full h-full"
                  />
                </div>

                <!-- Bad Sky - Light Polluted -->
                <div
                  class="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-primary-950/80"
                ></div>
                <div class="absolute right-0 inset-y-0 w-1/2">
                  <IBImage
                    :img="{
                      src: '/images/darksky/light-polluted-sky.jpg',
                      alt: 'Light polluted night sky',
                      width: 600,
                      height: 400,
                    }"
                    class="object-cover w-full h-full"
                  />
                </div>

                <!-- Slider Divider Line -->
                <div
                  class="absolute inset-y-0 right-1/2 w-1 bg-primary-400 shadow-lg shadow-primary-400/50 z-10"
                ></div>

                <!-- Labels -->
                <div
                  class="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded text-white text-sm font-medium"
                >
                  Natural Night Sky
                </div>
                <div
                  class="absolute bottom-4 right-4 bg-black/60 px-3 py-1 rounded text-white text-sm font-medium"
                >
                  Light Polluted Sky
                </div>
              </div>
            </div>
            <div class="p-4 text-sm text-gray-300 text-center">
              Over 80% of the world's population lives under light-polluted skies, limiting their
              view of stars and disconnecting them from the natural night environment.
            </div>
          </LandingGlass>
        </div>
      </div>
    </div>

    <!-- Background Stars -->
    <div class="absolute inset-0 overflow-hidden z-0 opacity-20 pointer-events-none">
      <div
        v-for="i in 30"
        :key="i"
        class="absolute rounded-full bg-white"
        :style="{
          width: `${Math.random() * 2 + 1}px`,
          height: `${Math.random() * 2 + 1}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          opacity: Math.random() * 0.8 + 0.2,
          animation: `twinkle ${Math.random() * 4 + 2}s ease-in-out infinite`,
        }"
      ></div>
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
