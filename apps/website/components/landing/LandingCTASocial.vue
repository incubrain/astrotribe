<script setup lang="ts">
import { onMounted } from 'vue'
import { useAnimation } from '~/composables/useAnimation'

const { fadeInUp, scaleIn } = useAnimation()

const { socials } = useSocialLinks()

const socialMedia = computed(() => {
  return socials.map((social) => {
    return {
      name: social.platform,
      icon: social.icon,
      link: social.url,
      gradient: `from-${social.color.from}-500 to-${social.color.to}-600`,
      hoverGradient: `hover:from-${social.color.from}-400 hover:to-${social.color.to}-500`,
    }
  })
})

onMounted(() => {
  fadeInUp('.social-media-cta')
  scaleIn('.social-button')
})

</script>

<template>
  <section>
    <LandingGlass
      hover-effect="glow"
      glow-color="purple"
      gradient="mixed"
      intensity="low"
      interactive
      isolate-content
    >
      <div class="social-media-cta space-y-12">
        <!-- Social Media Section -->
        <div class="text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4 font-space">
            Let's stay in touch
          </h2>
          <p class="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the community and stay updated with the latest space news and platform updates
          </p>

          <!-- Social Buttons -->
          <div class="flex flex-wrap justify-center gap-4">
            <NuxtLink
              v-for="platform in socialMedia"
              :key="platform.name"
              :href="platform.link"
              class="social-button group"
            >
              <div class="relative">
                <!-- Button -->
                <PrimeButton
                  class="relative z-10 border-none min-w-[160px] bg-gradient-to-r transition-all duration-300"
                  :class="[platform.gradient, platform.hoverGradient]"
                  size="large"
                >
                  <template #icon>
                    <Icon
                      :name="platform.icon"
                      size="24"
                    />
                  </template>
                  {{ platform.name }}
                </PrimeButton>

                <!-- Glow Effect -->
                <div
                  class="absolute inset-0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 bg-gradient-to-r"
                  :class="platform.gradient"
                />
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Newsletter Section -->
        <!-- <div class="max-w-2xl mx-auto w-full space-y-6">
          <h3 class="text-xl text-center text-white">Subscribe to Our Newsletter</h3>

          <div class="relative">
            <div class="flex gap-4">
              <PrimeInputText
                class="flex-1 bg-primary-900/50 border-primary-800/50 focus:border-sky-500/50 rounded-lg"
                placeholder="Enter your email"
              />
              <PrimeButton
                label="Subscribe"
                class="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 transition-all duration-300"
              />
            </div>

            <p class="text-xs text-gray-400 mt-2 text-center">
              By subscribing, you agree to receive space-related updates. Unsubscribe at any time.
            </p>
          </div>
        </div> -->
      </div>
    </LandingGlass>
  </section>
</template>

<style scoped>
:deep(.p-inputtext) {
  background: rgba(15, 23, 42, 0.5);
  border-color: rgba(30, 41, 59, 0.5);
  color: white;
}

:deep(.p-inputtext:focus) {
  border-color: rgba(14, 165, 233, 0.5);
  box-shadow: none;
}

:deep(.p-inputtext::placeholder) {
  color: rgba(148, 163, 184, 0.7);
}
</style>
