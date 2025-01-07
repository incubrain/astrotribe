<script setup lang="ts">
const partners = [
  { name: 'Aadyah Aerospace', id: useId(), type: 'Private Space' },
  { name: 'Aeroin Space', id: useId(), type: 'Private Space' },
  { name: 'Agnikul', id: useId(), type: 'Private Space' },
  { name: 'Astrogate Labs', id: useId(), type: 'Private Space' },
  { name: 'Bellatrix Aerospace', id: useId(), type: 'Private Space' },
  { name: 'CNSA', id: useId(), type: 'Space Agency' },
  { name: 'CSA', id: useId(), type: 'Space Agency' },
  { name: 'Dhruva Space', id: useId(), type: 'Private Space' },
  { name: 'ESA', id: useId(), type: 'Space Agency' },
  { name: 'ISRO', id: useId(), type: 'Space Agency' },
  { name: 'JAXA', id: useId(), type: 'Space Agency' },
  { name: 'NASA', id: useId(), type: 'Space Agency' },
  { name: 'Pixxel', id: useId(), type: 'Private Space' },
  { name: 'Roscosmos', id: useId(), type: 'Space Agency' },
  { name: 'Skyroot Aerospace', id: useId(), type: 'Private Space' },
]

const isLaunching = ref(false)

const triggerLaunch = () => {
  isLaunching.value = true
  // Reset after animation completes (optional)
  setTimeout(() => {
    isLaunching.value = false
  }, 2000) // Match this with animation duration
}
</script>

<template>
  <div class="hoverflow-hidden">
    <div class="mx-auto px-4 py-8 flex flex-col gap-8">
      <!-- Title section -->
      <div
        class="flex items-center justify-center relative gap-2 mx-auto underline decoration-primary-600 underline-offset-8"
      >
        <h1 class="text-2xl font-bold text-white">Companies!</h1>
        <Icon
          class="-rotate-45 relative"
          name="ph:rocket-launch-duotone"
          size="32"
        />
        <h1 class="text-2xl font-bold text-white">Launching</h1>
        <Icon
          class="-rotate-45 relative -top-4"
          name="ph:rocket-launch-duotone"
          size="32"
        />
        <h1 class="text-2xl font-bold text-white">Real...</h1>
        <Icon
          class="-rotate-45 relative -top-8"
          name="ph:rocket-launch-duotone"
          size="32"
        />
        <h1 class="text-2xl font-bold text-white">Soon...</h1>
        <Icon
          class="-rotate-45 absolute -right-12 -top-12"
          name="ph:rocket-launch-duotone"
          size="32"
          @click="triggerLaunch"
        />
      </div>

      <!-- Scrolling layers -->
      <div class="space-y-4">
        <CompaniesScrolling
          :partners="partners"
          direction="left"
        />
        <CompaniesScrolling
          :partners="partners"
          direction="right"
        />
        <CompaniesScrolling
          :partners="partners"
          direction="left"
        />
        <CompaniesScrolling
          :partners="partners"
          direction="right"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
