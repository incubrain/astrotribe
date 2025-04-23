<script setup lang="ts">
import { ref } from 'vue'

// CTA button hover state
const isHovered = ref(false)

// Modal state
const isModalOpen = ref(false)

// Form data
const formData = ref({
  name: '',
  email: '',
  interest: '',
  message: '',
})

// Form handling
const isSubmitting = ref(false)
const showSuccessMessage = ref(false)

const submitForm = async () => {
  isSubmitting.value = true

  try {
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Reset form
    formData.value = {
      name: '',
      email: '',
      interest: '',
      message: '',
    }

    showSuccessMessage.value = true
    setTimeout(() => {
      showSuccessMessage.value = false
      isModalOpen.value = false
    }, 3000)
  } catch (error) {
    console.error('Error submitting form:', error)
  } finally {
    isSubmitting.value = false
  }
}

const { stars, isClient, shootingStars } = useStarfield(30, 3)
const { conf } = useAnimation()
</script>

<template>
  <ClientOnly>
    <section class="join-team-cta-section py-20 relative overflow-hidden">
      <!-- Background elements -->
      <div
        class="absolute inset-0 bg-gradient-to-b from-primary-900 to-primary-950 rounded-xl"
      ></div>

      <!-- Animated stars -->
      <div
        v-if="isClient"
        class="absolute inset-0"
      >
        <div
          v-for="star in stars"
          :key="star.id"
          class="absolute rounded-full bg-white"
          :style="star.style"
        />
      </div>

      <!-- Shooting stars -->
      <div
        v-for="shoot in shootingStars"
        :key="'shooting-' + shoot.id"
        class="shooting-star absolute w-[150px] h-px bg-white transform rotate-45 overflow-hidden"
        :style="shoot.style"
      ></div>

      <div class="wrapper relative z-10">
        <div class="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <!-- Jupiter visualization -->
          <div class="md:w-1/3 flex justify-center">
            <div
              class="relative w-full max-w-xs aspect-square rounded-full overflow-hidden bg-primary-900/30 border border-primary-600/20"
            >
              <PlanetModel
                planet-id="jupiter"
                :auto-rotate="true"
              />
            </div>
          </div>

          <!-- CTA content -->
          <div class="md:w-2/3 text-center md:text-left">
            <h2 class="text-2xl md:text-3xl font-bold mb-4 text-white">Join Our Celestial Team</h2>
            <p class="text-primary-200 text-lg mb-6">
              Are you passionate about astronomy, space-tech, and technology? Become part of our
              cosmic journey and help us bring the wonders of the universe to people worldwide.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <!-- <div class="relative inline-block">
                <PrimeButton
                  severity="primary"
                  @click="isModalOpen = true"
                >
                  <Icon name="mdi:rocket-launch" />
                  <span>Apply Now</span>
                </PrimeButton>
              </div> -->

              <NuxtLink to="/contact">
                <PrimeButton severity="primary">
                  <Icon name="mdi:email-outline" />
                  <span>Contact Us</span>
                </PrimeButton>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Application Modal -->
      <PrimeDialog
        v-model:visible="isModalOpen"
        modal
        :closable="true"
        :dismissable-mask="true"
        header="Join Our Team"
        :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      >
        <div class="p-4">
          <p class="mb-6 text-primary-200">
            Tell us about yourself and how you'd like to contribute to our mission. We'll get back
            to you soon!
          </p>

          <PrimeForm
            class="space-y-4"
            @submit.prevent="submitForm"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label
                  for="name"
                  class="block text-sm font-medium"
                  >Your Name</label
                >
                <PrimeInputText
                  id="name"
                  v-model="formData.name"
                  class="w-full"
                />
              </div>
              <div class="space-y-2">
                <label
                  for="email"
                  class="block text-sm font-medium"
                  >Email Address</label
                >
                <PrimeInputText
                  id="email"
                  v-model="formData.email"
                  class="w-full"
                />
              </div>
            </div>
            <div class="space-y-2">
              <label
                for="interest"
                class="block text-sm font-medium"
                >Area of Interest</label
              >
              <PrimeSelect
                id="interest"
                v-model="formData.interest"
                :options="[
                  'Astronomy Education',
                  'Technology & Development',
                  'Event Planning',
                  'Dark Sky Conservation',
                  'Content Creation',
                  'Other',
                ]"
                placeholder="Select your area of interest"
                class="w-full"
              />
            </div>
            <div class="space-y-2">
              <label
                for="message"
                class="block text-sm font-medium"
                >Tell us about yourself</label
              >
              <PrimeTextarea
                id="message"
                v-model="formData.message"
                rows="5"
                placeholder="Share your experience, skills, and why you'd like to join us"
                class="w-full"
              />
            </div>
            <div class="flex justify-end pt-4">
              <PrimeButton
                type="submit"
                :loading="isSubmitting"
                class="bg-primary-600"
                >Submit Application</PrimeButton
              >
            </div>

            <div
              v-if="showSuccessMessage"
              class="mt-4 p-3 bg-green-800/50 text-green-200 rounded text-center"
            >
              Application submitted successfully! We'll get back to you soon.
            </div>
          </PrimeForm>
        </div>
      </PrimeDialog>
    </section>
  </ClientOnly>
</template>

<style scoped>
.shooting-star::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 30px;
  height: 1px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);
  animation: shooting 3s linear infinite;
}

@keyframes shooting {
  0% {
    transform: translateX(-100px);
  }
  100% {
    transform: translateX(150px);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
}
</style>
