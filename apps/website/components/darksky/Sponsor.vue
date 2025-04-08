<script setup lang="ts">
import { ref } from 'vue'

// Sponsor tiers with benefits
const sponsorTiers = ref([
  {
    name: 'Hero',
    icon: '🏆',
    price: '$5,000+',
    benefits: [
      'Prime logo placement on our website',
      'Recognition at all AstronEra events worldwide',
      'Featured in our yearly "State of Dark Skies" report',
      'Exclusive access to dark sky data and research',
      'Custom astronomical event for your team',
      'Personalized "Dark Sky Defender" plaque',
    ],
    highlight: true,
  },
  {
    name: 'Gold',
    icon: '🌟',
    price: '$2,500+',
    benefits: [
      'Logo on our website sponsor section',
      'Recognition at local AstronEra events',
      'Mention in our quarterly newsletter',
      'Invitation to dark sky conservation events',
      'Team stargazing experience',
    ],
    highlight: false,
  },
  {
    name: 'Silver',
    icon: '✨',
    price: '$1,000+',
    benefits: [
      'Logo on our website sponsor section',
      'Social media recognition',
      'Mention in our quarterly newsletter',
      'Dark sky merchandise package',
    ],
    highlight: false,
  },
])

// Featured sponsors - would be populated from a CMS or API in a real implementation
const featuredSponsors = ref([
  {
    name: 'Celestron',
    logo: '/images/sponsors/celestron.svg',
    tier: 'Hero',
  },
  {
    name: 'Sky-Watcher',
    logo: '/images/sponsors/skywatcher.svg',
    tier: 'Gold',
  },
  {
    name: 'NASA',
    logo: '/images/sponsors/nasa.svg',
    tier: 'Gold',
  },
])

// Contact form state
const contactForm = ref({
  name: '',
  organization: '',
  email: '',
  message: '',
  tier: '',
})

// Form handling state
const isSubmitting = ref(false)
const showSuccessMessage = ref(false)

// Form submission handler
const submitSponsorForm = async () => {
  isSubmitting.value = true

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Reset form
    contactForm.value = {
      name: '',
      organization: '',
      email: '',
      message: '',
      tier: '',
    }

    // Show success message
    showSuccessMessage.value = true
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 5000)
  } catch (error) {
    console.error('Error submitting sponsor form:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Animation hook setup
const { conf } = useAnimation()
</script>

<template>
  <section class="sponsor-us-section py-16 relative">
    <div class="wrapper">
      <!-- Section header -->
      <div
        v-motion
        class="text-center mb-16"
        :initial="conf.fadeUp.initial"
        :enter="conf.fadeUp.enter"
      >
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">Our Sponsors</h2>
        <p class="text-xl text-primary-200 max-w-2xl mx-auto">
          You help us build a better future for dark skies
        </p>
      </div>

      <!-- Sponsor tiers section -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div
          v-for="(tier, index) in sponsorTiers"
          :key="tier.name"
          v-motion
          class="sponsor-tier"
          :initial="conf.fadeUp.initial"
          :enter="{
            ...conf.fadeUp.enter,
            transition: { ...conf.fadeUp.enter.transition, delay: index * 0.1 },
          }"
        >
          <IBGlass
            :hover-effect="tier.highlight ? 'glow' : undefined"
            :glow-color="tier.highlight ? 'gold' : undefined"
            :gradient="tier.highlight ? 'orange' : 'blue'"
            :intensity="tier.highlight ? 'medium' : 'low'"
            :interactive="true"
            class="h-full"
          >
            <div class="p-6 flex flex-col h-full">
              <!-- Tier header -->
              <div class="flex items-center mb-4">
                <span class="text-2xl mr-2">{{ tier.icon }}</span>
                <h3 class="text-xl font-bold text-white">{{ tier.name }} Sponsor</h3>
              </div>

              <!-- Tier price -->
              <div class="text-2xl font-bold text-primary-400 mb-4">{{ tier.price }}</div>

              <!-- Benefits list -->
              <ul class="space-y-2 text-gray-300 mb-6 flex-grow">
                <li
                  v-for="(benefit, i) in tier.benefits"
                  :key="i"
                  class="flex items-start"
                >
                  <Icon
                    name="mdi:check-circle"
                    class="text-primary-500 mt-1 mr-2 flex-shrink-0"
                  />
                  <span>{{ benefit }}</span>
                </li>
              </ul>

              <!-- CTA button -->
              <div>
                <PrimeButton
                  :severity="tier.highlight ? 'warning' : 'secondary'"
                  class="w-full"
                  @click="contactForm.tier = tier.name"
                >
                  <span>Become a {{ tier.name }} Sponsor</span>
                </PrimeButton>
              </div>
            </div>
          </IBGlass>
        </div>
      </div>

      <!-- Current sponsors showcase -->
      <div
        v-motion
        class="mb-16"
        :initial="conf.fadeUp.initial"
        :enter="{
          ...conf.fadeUp.enter,
          transition: { ...conf.fadeUp.enter.transition, delay: 0.3 },
        }"
      >
        <IBGlass
          hover-effect="subtle"
          gradient="mixed"
          intensity="minimal"
        >
          <div class="p-6">
            <h3 class="text-2xl font-bold text-white mb-6 text-center">Featured Sponsors</h3>

            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              <!-- We would use real sponsor logos here -->
              <div
                v-for="i in 6"
                :key="i"
                class="aspect-square bg-surface-100/30 rounded-lg flex items-center justify-center p-4"
              >
                <div class="text-gray-400 text-xl">Logo {{ i }}</div>
              </div>
            </div>
          </div>
        </IBGlass>
      </div>

      <!-- Contact form section -->
      <div
        v-motion
        :initial="conf.fadeUp.initial"
        :enter="{
          ...conf.fadeUp.enter,
          transition: { ...conf.fadeUp.enter.transition, delay: 0.4 },
        }"
      >
        <IBGlass
          hover-effect="glow"
          glow-color="blue"
          gradient="blue"
          intensity="low"
        >
          <div class="p-6 md:p-8">
            <div class="md:flex gap-8">
              <!-- Info section -->
              <div class="md:w-1/3 mb-8 md:mb-0">
                <h3 class="text-2xl font-bold text-white mb-4">Become a Sponsor</h3>
                <p class="text-gray-300 mb-6">
                  Join our mission to preserve dark skies and promote astronomy worldwide.
                  Your support makes a direct impact on our conservation efforts.
                </p>

                <div class="space-y-4">
                  <div class="flex items-start">
                    <Icon
                      name="mdi:star"
                      class="text-primary-400 mt-1 mr-3 flex-shrink-0"
                    />
                    <div>
                      <h4 class="font-semibold text-white">Brand Visibility</h4>
                      <p class="text-sm text-gray-400"
                        >Reach astronomy enthusiasts and environmentally conscious audiences</p
                      >
                    </div>
                  </div>

                  <div class="flex items-start">
                    <Icon
                      name="mdi:earth"
                      class="text-primary-400 mt-1 mr-3 flex-shrink-0"
                    />
                    <div>
                      <h4 class="font-semibold text-white">Social Impact</h4>
                      <p class="text-sm text-gray-400"
                        >Demonstrate your commitment to environmental protection</p
                      >
                    </div>
                  </div>

                  <div class="flex items-start">
                    <Icon
                      name="mdi:telescope"
                      class="text-primary-400 mt-1 mr-3 flex-shrink-0"
                    />
                    <div>
                      <h4 class="font-semibold text-white">Exclusive Events</h4>
                      <p class="text-sm text-gray-400"
                        >Access to special astronomical events and networking opportunities</p
                      >
                    </div>
                  </div>
                </div>
              </div>

              <!-- Form section -->
              <div class="md:w-2/3">
                <form @submit.prevent="submitSponsorForm">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        for="name"
                        class="block text-white mb-1"
                        >Your Name</label
                      >
                      <PrimeInputText
                        id="name"
                        v-model="contactForm.name"
                        class="w-full"
                      />
                    </div>

                    <div>
                      <label
                        for="organization"
                        class="block text-white mb-1"
                        >Organization</label
                      >
                      <PrimeInputText
                        id="organization"
                        v-model="contactForm.organization"
                        class="w-full"
                      />
                    </div>
                  </div>

                  <div class="mb-4">
                    <label
                      for="email"
                      class="block text-white mb-1"
                      >Email</label
                    >
                    <PrimeInputText
                      id="email"
                      v-model="contactForm.email"
                      type="email"
                      class="w-full"
                    />
                  </div>

                  <div class="mb-4">
                    <label
                      for="tier"
                      class="block text-white mb-1"
                      >Interested In</label
                    >
                    <PrimeSelect
                      id="tier"
                      v-model="contactForm.tier"
                      :options="
                        sponsorTiers.map((t) => ({ label: t.name + ' Sponsor', value: t.name }))
                      "
                      placeholder="Select a sponsorship tier"
                      class="w-full"
                    />
                  </div>

                  <div class="mb-4">
                    <label
                      for="message"
                      class="block text-white mb-1"
                      >Message</label
                    >
                    <PrimeTextarea
                      id="message"
                      v-model="contactForm.message"
                      rows="4"
                      class="w-full"
                      placeholder="Tell us about your organization and any specific questions"
                    />
                  </div>

                  <div class="flex justify-end">
                    <PrimeButton
                      type="submit"
                      :loading="isSubmitting"
                      severity="primary"
                      size="large"
                      class="px-6"
                    >
                      <span v-if="isSubmitting">Sending...</span>
                      <span v-else>Submit Sponsorship Inquiry</span>
                    </PrimeButton>
                  </div>

                  <!-- Success message -->
                  <div
                    v-if="showSuccessMessage"
                    class="mt-4 p-3 bg-green-800/50 text-green-200 rounded text-center"
                  >
                    Thank you for your interest! We'll get back to you shortly to discuss
                    sponsorship opportunities.
                  </div>
                </form>
              </div>
            </div>
          </div>
        </IBGlass>
      </div>
    </div>
  </section>
</template>

<style scoped>
.wrapper {
  max-width: var(--max-width-lg);
  margin: 0 auto;
  padding: 0 var(--px-sm);
}

@media (min-width: 768px) {
  .wrapper {
    padding: 0 var(--px-md);
  }
}

@media (min-width: 1024px) {
  .wrapper {
    padding: 0 var(--px-lg);
  }
}
</style>
