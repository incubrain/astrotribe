<template>
  <div class="dark relative z-0 bg-gradient-to-b from-[#05070f] to-[#0e111c] text-white">
    <div class="wrapper relative z-10 py-16 md:py-24 space-y-16 md:space-y-24">
      <!-- Title Section -->
      <div
        v-motion
        class="space-y-12"
        :initial="{ opacity: 0, y: 50 }"
        :enter="{ opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } }"
      >
        <div class="flex gap-4 md:gap-12 items-center">
          <div class="flex justify-center items-center mt-4 mb-6">
            <div class="relative">
              <div class="absolute inset-0 rounded-full bg-primary-600/20 blur-xl"></div>
              <div
                class="relative flex items-center justify-center w-40 h-40 border-2 border-primary-500/50 rounded-full bg-primary-900/50 shadow-lg"
              >
                <div class="flex flex-col items-center text-center">
                  <Icon
                    name="mdi:check-decagram"
                    class="text-primary-400 mb-1"
                    size="40px"
                  />
                  <span class="text-lg font-semibold text-white">OFFICIALLY</span>
                  <span class="text-base font-bold text-primary-400">RECOGNIZED</span>
                  <span class="text-[14px] text-primary-200 mt-1">MAY 2025</span>
                </div>
              </div>
            </div>
          </div>
          <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold text-white">
            DarkSky International Recognizes AstronEra
          </h1>
        </div>
        <div class="flex gap-4 md:gap-8 justify-center items-center">
          <div class="flex justify-center items-center">
            <!-- Replace the current PrimeMessage with this enhanced version -->
            <div class="mx-auto flex justify-center items-center">
              <div
                class="bg-gradient-to-r from-primary-800/70 to-indigo-800/70 border border-primary-600/30 rounded-lg px-6 py-3 max-w-xl shadow-lg"
              >
                <div class="flex flex-col items-center">
                  <span class="text-primary-400 font-bold uppercase text-xs tracking-wider mb-1"
                    >Breaking Boundaries</span
                  >
                  <h2 class="text-white text-center text-xl font-bold"
                    >🇮🇳 India's First & Only Organization Recognized by DarkSky International</h2
                  >
                  <div class="flex items-center mt-2">
                    <div class="h-px w-12 bg-primary-600/50"></div>
                    <span class="text-primary-200 text-sm mx-3">Setting a national precedent</span>
                    <div class="h-px w-12 bg-primary-600/50"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Certificate + Characters -->
      <div class="grid md:grid-cols-2 gap-10 items-start max-w-6xl mx-auto">
        <!-- Certificate Image -->
        <div
          v-motion
          class="flex justify-center row-start-1 md:col-span-2 col-start-1"
          :initial="{ opacity: 0, scale: 0.9 }"
          :enter="{
            opacity: 1,
            scale: 1,
            transition: { type: 'spring', stiffness: 200, damping: 20, delay: 0.2 },
          }"
        >
          <IBImage
            :img="{
              src: '/images/darksky-international-acknowledgement-certificate.png',
              alt: 'DarkSky Certificate',
            }"
            class="w-full rounded-lg object-contain"
          />
        </div>

        <!-- Characters -->
        <div class="flex gap-8 md:col-span-2 col-start-1">
          <!-- Tara -->
          <IBGlass
            hover-effect="glow"
            gradient="mixed"
            intensity="low"
            class="p-4 flex-1"
          >
            <div
              v-motion
              class="flex items-start justify-center space-x-4"
              :initial="{ opacity: 0, x: 50 }"
              :enter="{
                opacity: 1,
                x: 0,
                transition: { type: 'spring', stiffness: 200, damping: 20, delay: 0.3 },
              }"
            >
              <IBImage
                :img="{
                  src: '/images/tara/tara-pose-cheerful.png',
                  alt: 'Tara cartoon',
                  width: 64,
                  height: 64,
                }"
                class="w-16 h-16 object-contain"
              />
              <div class="text-base">
                <strong class="text-primary-400">Tara:</strong><br />
                "Guess what?! We got a galactic shoutout from DarkSky International! 🌌 We're
                officially India's dark sky heroes!"
              </div>
            </div>
          </IBGlass>

          <!-- Shweta -->
          <IBGlass
            hover-effect="glow"
            gradient="purple"
            intensity="low"
            class="p-4 flex-1"
          >
            <div
              v-motion
              class="flex items-start space-x-4"
              :initial="{ opacity: 0, x: 50 }"
              :enter="{
                opacity: 1,
                x: 0,
                transition: { type: 'spring', stiffness: 200, damping: 20, delay: 0.5 },
              }"
            >
              <IBImage
                :img="{
                  src: '/images/team/shweta-kulkarni-cartoon.png',
                  alt: 'Shweta cartoon',
                  width: 64,
                  height: 64,
                }"
                class="w-16 h-16 object-contain"
              />

              <div class="text-base">
                <strong class="text-primary-400">Shweta:</strong><br />
                "This means everything. Every late night, every workshop, every tribe we worked
                with—it all led to this moment. And it's just the beginning!"
              </div>
            </div>
          </IBGlass>
        </div>
      </div>

      <!-- Description -->
      <div
        v-motion
        class="max-w-3xl mx-auto text-center text-lg md:text-xl leading-relaxed text-primary-100"
        :initial="{ opacity: 0, y: 30 }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: { type: 'spring', stiffness: 200, damping: 20, delay: 0.6 },
        }"
      >
        ⭐ We're over the moon (literally) to be recognized for our work in dark sky conservation
        across India.
        <br /><br />
        As the only organization in India acknowledged by DarkSky International, this moment is fuel
        for our mission—and proof that passion, community, and a love for the stars can change the
        world.
      </div>

      <!-- Highlight Section -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: { type: 'spring', stiffness: 200, damping: 20, delay: 0.7 },
        }"
        class="max-w-2xl mx-auto"
      >
        <IBGlass
          hover-effect="glow"
          glow-color="blue"
          gradient="mixed"
          intensity="medium"
          interactive
          class="p-6"
        >
          <h2 class="text-lg font-semibold mb-4 text-primary-400 text-center">
            ✨ Why it matters:
          </h2>
          <ul class="list-none text-base space-y-3 text-primary-200">
            <li class="flex items-center">
              <Icon
                name="mdi:check-circle"
                class="text-primary-500 mr-2"
                size="20px"
              />
              First and only Indian org recognized
            </li>
            <li class="flex items-center">
              <Icon
                name="mdi:check-circle"
                class="text-primary-500 mr-2"
                size="20px"
              />
              Boosts India's dark sky movement
            </li>
            <li class="flex items-center">
              <Icon
                name="mdi:check-circle"
                class="text-primary-500 mr-2"
                size="20px"
              />
              Validates grassroots + tribal outreach
            </li>
            <li class="flex items-center">
              <Icon
                name="mdi:check-circle"
                class="text-primary-500 mr-2"
                size="20px"
              />
              Global spotlight on our mission
            </li>
          </ul>
        </IBGlass>
      </div>

      <!-- CTA -->
      <div
        v-motion
        class="text-center flex flex-col gap-6"
        :initial="{ opacity: 0, y: 30 }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: { type: 'spring', stiffness: 200, damping: 20, delay: 0.8 },
        }"
      >
        <p class="text-xl font-medium text-primary-100">
          🚀 Help us make more skies darker and stars brighter.
        </p>
        <!-- Replace the current PrimeButton in the CTA section with this -->
        <NuxtLink to="/darksky">
          <PrimeButton
            v-motion
            :initial="{ opacity: 0, scale: 0.9 }"
            :enter="{
              opacity: 1,
              scale: 1,
              transition: { type: 'spring', stiffness: 300, damping: 15, delay: 0.9 },
            }"
            class="px-8 py-4 text-lg font-bold shadow-xl"
            :pt="{
              root: {
                class: [
                  'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500',
                  'border-0 text-white rounded-xl relative overflow-hidden group',
                ],
              },
            }"
          >
            <!-- Add a subtle animated highlight effect -->
            <div
              class="absolute inset-0 bg-white/5 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
            ></div>
            <div class="relative flex items-center justify-center">
              <Icon
                name="mdi:arrow-right-circle"
                class="mr-2"
                size="24px"
              />
              <span>Learn More About Dark Sky Conservation</span>
            </div>
          </PrimeButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Static content page
</script>

<style scoped></style>
