<script setup lang="ts">
defineProps<{
  astronomyMission: string
  darkSkyObjectives: string[]
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
      <IBGlass
        hover-effect="glow"
        glow-color="purple"
        gradient="mixed"
        intensity="low"
        interactive
        padding
      >
        <div class="flex flex-col h-full justify-between gap-4">
          <div class="h-auto">
            <h3 class="text-2xl font-bold mb-4 text-white">Conserving the night sky</h3>
            <p class="text-base mb-6">{{ astronomyMission }}</p>
          </div>

          <div class="flex justify-end">
            <NuxtLink to="blog/dark-sky-conservation/saving-the-stars">
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
            </NuxtLink>
          </div>
        </div>
      </IBGlass>

      <!-- Dark Sky Preservation Panel -->
      <IBGlass
        hover-effect="glow"
        glow-color="purple"
        gradient="mixed"
        intensity="low"
        interactive
        padding
      >
        <div class="flex flex-col h-full justify-between gap-4">
          <div>
            <h3 class="text-2xl font-bold mb-4 text-white">Reducing light pollution</h3>
            <ul>
              <li
                v-for="(item, index) in darkSkyObjectives"
                :key="index"
                class="text-base mb-2"
              >
                <Icon
                  name="mdi:check"
                  class="text-green-400 mr-2"
                />
                {{ item }}
              </li>
            </ul>
          </div>

          <div class="flex justify-end mt-4">
            <NuxtLink to="blog/dark-sky-conservation/reducing-light-pollution">
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
            </NuxtLink>
          </div>
        </div>
      </IBGlass>
    </div>
  </section>
</template>
