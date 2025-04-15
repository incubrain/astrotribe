<script setup lang="ts">
import { getFooterNavigation } from '#shared/constants'

const { socials } = useSocialLinks()

const websiteLinks = getFooterNavigation()
</script>

<template>
  <footer class="wrapper py-8 gap-8 w-full relative flex flex-col">
    <LandingGlass
      hover-effect="glow"
      glow-color="purple"
      gradient="mixed"
      intensity="low"
      interactive
    >
      <!-- Main Footer Content -->
      <div class="relative z-10 w-full">
        <!-- First section: Logo, Links, Social -->
        <div class="flex flex-col gap-8 w-full lg:grid lg:grid-cols-[140px_3fr_140px] mb-8">
          <!-- Logo Section -->
          <div class="flex items-center justify-center lg:items-start lg:justify-start">
            <NuxtLink
              to="/"
              class="flex items-center gap-4 group"
            >
              <div class="flex gap-4 rounded-md p-1">
                <div
                  class="relative flex h-[36px] w-[36px] items-center justify-center rounded-md border bg-white p-1 md:h-[44px] md:w-[44px]"
                >
                  <IBImage
                    :img="{ src: '/astronera-logo.jpg' }"
                    class="h-full w-full opacity-90"
                  />
                </div>
                <div class="flex justify-center">
                  <h1
                    class="mt-[2px] flex cursor-pointer flex-col items-start justify-start pr-2 text-sm font-bold uppercase leading-none tracking-normal"
                  >
                    Astron
                    <strong class="font-extrabold text-primary-400">Era</strong>
                  </h1>
                </div>
              </div>
            </NuxtLink>
          </div>

          <!-- Links Section -->
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 xl:gap-8 w-full shrink-0"
          >
            <div
              v-for="link in websiteLinks"
              :key="link.key"
              class="space-y-4"
            >
              <h4 class="font-space text-lg text-white text-center lg:text-left">
                {{ link.label }}
              </h4>
              <ul class="space-y-2">
                <li
                  v-for="item in link.items"
                  :key="item.key"
                  class="text-center lg:text-left"
                >
                  <NuxtLink
                    :to="item.url"
                    class="text-gray-400 hover:text-sky-400 transition-colors duration-300 text-sm inline-block"
                  >
                    {{ item.label }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>

          <!-- Social Links -->
          <div class="flex flex-row justify-center gap-4 lg:flex-col lg:items-end lg:justify-start">
            <NuxtLink
              v-for="social in socials"
              :key="social.id"
              :to="social.url"
              target="_blank"
              class="group relative p-2 rounded-lg transition-all duration-300 hover:bg-sky-500/10 flex"
            >
              <Icon
                :name="social.icon"
                class="text-gray-400 group-hover:text-sky-400 transition-colors duration-300"
                size="24px"
              />
            </NuxtLink>
          </div>
        </div>

        <!-- Divider -->
        <div
          class="w-full h-px bg-gradient-to-r from-transparent via-primary-800/30 to-transparent my-6"
        ></div>

        <!-- Newsletter Section -->
        <div class="w-full max-w-md mx-auto">
          <NewsletterSignup />
        </div>
      </div>
    </LandingGlass>
    <NavFooterBottomBar class="relative z-10" />
  </footer>
</template>

<style>
@keyframes glow {
  0%,
  100% {
    box-shadow:
      0 0 0 1px rgba(74, 222, 255, 0.1),
      0 0 8px rgba(74, 222, 255, 0.1),
      inset 0 0 4px rgba(74, 222, 255, 0.1);
  }
  50% {
    box-shadow:
      0 0 0 1px rgba(74, 222, 255, 0.2),
      0 0 16px rgba(74, 222, 255, 0.2),
      inset 0 0 8px rgba(74, 222, 255, 0.2);
  }
}

.animate-glow {
  animation: glow 4s ease-in-out infinite;
}
</style>
