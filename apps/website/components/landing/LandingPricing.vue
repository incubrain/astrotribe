<script setup lang="ts">
import { onMounted } from 'vue'
import { useAnimation } from '~/composables/useAnimation'

const { fadeInUp } = useAnimation()

const features = [
  'Daily space news updates',
  'Basic search functionality',
  'Community forums access',
  'Email notifications',
  'Email notifications',
  'Email notifications',
  'Email notifications',
]

onMounted(() => {
  fadeInUp('.pricing-card')
})
</script>

<template>
  <section class="pricing-section py-16">
    <div>
      <LandingTitle
        title="Unlimited access for FREE"
        subtitle="AstronEra offers the most comprehensive space news."
        class="max-w-2xl mx-auto"
      />

      <div class="flex justify-center">
        <IBGlass class="pricing-card">
          <h3 class="text-3xl font-extrabold pb-4">FREE Forever Plan</h3>
          <ul class="mb-8 border-y border-color py-4">
            <li
              v-for="feature in features"
              :key="feature"
              class="flex items-center mb-3"
            >
              <Icon
                name="mdi:check-circle"
                class="mr-3 text-green-500"
                size="24"
              />
              <span>{{ feature }}</span>
            </li>
          </ul>
          <div class="flex gap-8 mb-8 w-full">
            <div class="">
              <span class="text-4xl font-bold">$0</span>
              <span class="text-xl">/month</span>
            </div>
            <div class="flex items-center">
              <h4 class="text-xl bg-emerald-700/30 underline underline-offset-4 px-2 py-1"
                >RISK FREE</h4
              >
            </div>
          </div>
          <p class="text-sm text-center mb-6">
            No credit card required. Start exploring the cosmos today!
          </p>
          <PrimeButton
            label="Get Started"
            class="w-full"
            size="large"
          />
        </IBGlass>
      </div>
    </div>
  </section>
</template>

<style></style>
