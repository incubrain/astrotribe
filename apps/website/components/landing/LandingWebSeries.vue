<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAnimation } from '~/composables/useAnimation'

const loadVideo = ref(false)

const patreonPerks = [
  'Behind-the-scenes content',
  'Early access to episodes',
  'Monthly Q&A sessions',
  'Exclusive tutorials',
  'Development insights',
]

</script>

<template>
  <section class="space-y-8">
    <!-- Optional Title Section -->
    <LandingTitle
      title="Startups Guide to the Galaxy"
      subtitle="Follow our journey building AstronEra and learn from our experiences"
    />
    <div class="content-section space-y-8">
      <!-- Main Grid -->
      <!-- <div class="grid md:grid-cols-2 gap-8">
        <LandingGlass
          hover-effect="glow"
          glow-color="purple"
          gradient="mixed"
          intensity="low"
          interactive
          isolate-content
        >
          <div class="relative group">
            <div
              class="relative rounded-xl transition-all duration-500 hover:border-sky-500/30 h-full"
            >
              <div class="relative z-10 h-full flex flex-col">
                <Icon
                  name="mdi:video-vintage"
                  size="48"
                  class="text-sky-400 mb-6"
                />
                <h3 class="text-2xl font-bold text-white mb-4 font-space"> Building in Public </h3>
                <p class="text-gray-300 mb-6">
                  Watch as we navigate the challenges of building a space-tech startup. From
                  ideation to launch, we share every step of our journey.
                </p>
                <div class="mt-auto">
                  <span
                    class="px-3 py-1 rounded-full text-xs bg-sky-500/10 border border-sky-500/20 text-sky-400"
                  >
                    New Episode Every Two Weeks
                  </span>
                </div>
              </div>
            </div>
          </div>
        </LandingGlass>

        <LandingGlass
          hover-effect="glow"
          glow-color="purple"
          gradient="mixed"
          intensity="low"
          interactive
          isolate-content
        >
          <div class="relative group">
            <div
              class="relative rounded-xl transition-all duration-500 hover:border-sky-500/30 h-full"
            >
              <div class="relative z-10 h-full flex flex-col">
                <Icon
                  name="mdi:patreon"
                  size="48"
                  class="text-red-400 mb-6"
                />
                <h3 class="text-2xl font-bold text-white mb-4 font-space">
                  Support Us on Patreon
                </h3>
                <div class="space-y-3 mb-6">
                  <div
                    v-for="perk in patreonPerks"
                    :key="perk"
                    class="flex items-center gap-2"
                  >
                    <Icon
                      name="mdi:check"
                      class="text-emerald-400"
                    />
                    <span class="text-gray-300">{{ perk }}</span>
                  </div>
                </div>
                <div class="mt-auto">
                  <NuxtLink
                    to="https://www.patreon.com/YourPatreonLink"
                    target="_blank"
                  >
                    <PrimeButton
                      size="large"
                      class="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 transition-all duration-300"
                    >
                      Become a Patron
                    </PrimeButton>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </LandingGlass>
      </div> -->

      <!-- Video Section -->
      <LandingGlass
        hover-effect="glow"
        glow-color="purple"
        gradient="mixed"
        intensity="low"
        interactive
        isolate-content
      >
        <div class="relative group">
          <div class="relative rounded-xl transition-all duration-500 hover:border-sky-500/30">
            <!-- Video Container -->
            <div class="aspect-video relative rounded-lg overflow-hidden">
              <img
                v-if="!loadVideo"
                src="https://img.youtube.com/vi/gMG621m6QRE/maxresdefault.jpg"
                alt="Startups Guide to the Galaxy - AstronEra"
                class="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                @click="loadVideo = true"
              />
              <div
                v-if="!loadVideo"
                class="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/40 transition-colors duration-300"
              >
                <Icon
                  name="mdi:play-circle"
                  size="72"
                  class="text-white/90 hover:text-white transition-colors duration-300"
                />
              </div>
              <iframe
                v-else
                src="https://www.youtube.com/embed/gMG621m6QRE?start=488&autoplay=1"
                title="Startups Guide to the Galaxy - AstronEra"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                class="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      </LandingGlass>
      <LazyLandingCTASocial />
    </div>
  </section>
</template>

<style scoped></style>
