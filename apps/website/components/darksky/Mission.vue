<script setup lang="ts">
defineProps<{
  astronomyEducation: string
  darkSkyPreservation: string
}>()
</script>

<template>
  <section class="py-16">
    <LandingTitle
      title="Our Mission"
      subtitle="Preserving the night sky for everyone"
      class="mb-12"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Education Panel -->
      <LandingGlass
        hover-effect="glow"
        glow-color="blue"
        gradient="blue"
        intensity="low"
        interactive
      >
        <h3 class="text-2xl font-bold mb-4 text-white">Conserving the night sky</h3>
        <p class="text-base mb-6">{{ astronomyEducation }}</p>

        <div class="flex justify-end">
          <PrimeButton
            size="small"
            severity="secondary"
            outlined
          >
            Learn more
            <Icon
              name="mdi:arrow-right"
              class="ml-2"
            />
          </PrimeButton>
        </div>
      </LandingGlass>

      <!-- Dark Sky Preservation Panel -->
      <LandingGlass
        hover-effect="glow"
        glow-color="purple"
        gradient="purple"
        intensity="low"
        interactive
      >
        <h3 class="text-2xl font-bold mb-4 text-white">Reducing light pollution</h3>
        <p class="text-base mb-6">{{ darkSkyPreservation }}</p>

        <div class="flex justify-end">
          <PrimeButton
            size="small"
            severity="secondary"
            outlined
          >
            Learn more
            <Icon
              name="mdi:arrow-right"
              class="ml-2"
            />
          </PrimeButton>
        </div>
      </LandingGlass>
    </div>
  </section>
</template>
