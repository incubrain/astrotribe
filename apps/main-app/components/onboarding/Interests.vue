<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4"> Select Your Interests </h2>
    <form @submit.prevent="handleSubmit">
      <div class="p-fluid">
        <div class="p-field">
          <label for="interests">Astronomy and Space Tech Interests</label>
          <PrimeMultiSelect
            id="interests"
            v-model="selectedInterests"
            :options="interestOptions"
            option-label="name"
            placeholder="Select your interests"
            :filter="true"
            :class="{ 'p-invalid': errors.interests }"
          />
          <small
            v-if="errors.interests"
            class="p-error"
            >{{ errors.interests }}</small
          >
        </div>
      </div>
      <PrimeButton
        type="submit"
        label="Save Interests"
        class="mt-4"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

const interestOptions = [
  { name: 'Astrophysics' },
  { name: 'Cosmology' },
  { name: 'Planetary Science' },
  { name: 'Exoplanets' },
  { name: 'Astrobiology' },
  { name: 'Radio Astronomy' },
  { name: 'Stellar Evolution' },
  { name: 'Galactic Astronomy' },
  { name: 'Black Holes' },
  { name: 'Dark Matter and Dark Energy' },
  { name: 'Space Exploration' },
  { name: 'Rocket Propulsion' },
  { name: 'Satellite Technology' },
  { name: 'Space Telescopes' },
  { name: 'Gravitational Waves' },
  { name: 'Solar Physics' },
  { name: 'Astrochemistry' },
  { name: 'Astrogeology' },
  { name: 'Space Weather' },
  { name: 'Astronomical Instrumentation' },
  { name: 'Extragalactic Astronomy' },
  { name: 'Astroparticle Physics' },
  { name: 'Spacecraft Engineering' },
  { name: 'Space Medicine' },
  { name: 'Asteroids and Comets' },
]

const selectedInterests = ref([])
const errors = ref({})

const interestsSchema = z.object({
  interests: z.array(z.object({ name: z.string() })).min(1, 'Please select at least one interest'),
})

const handleSubmit = () => {
  const result = interestsSchema.safeParse({ interests: selectedInterests.value })
  if (result.success) {
    // Clear any previous errors
    errors.value = {}
    // Submit the interests to your API
    console.log('Interests submitted:', selectedInterests.value)
    // You can add your API call here
  } else {
    // Update errors
    errors.value = result.error.flatten().fieldErrors
  }
}
</script>
