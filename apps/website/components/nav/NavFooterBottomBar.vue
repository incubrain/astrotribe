<script setup lang="ts">
import { getPolicyPageKeys } from '#shared/constants'

const policies = getPolicyPageKeys()
const currentYear = new Date().getFullYear()
</script>

<template>
  <div class="relative w-full">
    <LandingGlass
      hover-effect="glow"
      glow-color="purple"
      gradient="mixed"
      intensity="low"
      interactive
      isolate-content
    >
      <div class="flex flex-col gap-6 text-sm">
        <!-- Policies Links -->
        <div class="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <NuxtLink
            v-for="policy in policies"
            :key="policy"
            :to="`/policies/${policy}`"
            class="policy-link relative"
          >
            <span
              class="text-gray-400 hover:text-primary-400 transition-colors duration-300 capitalize"
            >
              {{ policy.replace('-', ' ') }}
            </span>
          </NuxtLink>
        </div>

        <!-- Copyright Text -->
        <div class="text-center text-gray-400">
          <p class="inline-flex items-center gap-1">
            ©2018 - {{ currentYear }} AstronEra. All rights reserved - Made with
            <span class="inline-block animate-pulse text-red-500">❤️</span>
            by
            <a
              href="https://www.incubrain.org/"
              target="_blank"
              class="incubrain-link relative ml-1 text-primary-400 hover:text-primary-300 transition-colors duration-300"
            >
              Incubrain
            </a>
          </p>
        </div>
      </div>
    </LandingGlass>
  </div>
</template>

<style scoped>
/* Policy link hover effect */
.policy-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 0;
  height: 1px;
  background-color: var(--primary-400);
  transition: width 0.3s ease;
}

.policy-link:hover::after {
  width: 100%;
}

/* Incubrain link hover effect */
.incubrain-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 0;
  height: 1px;
  background-color: var(--primary-400);
  transition: width 0.3s ease;
}

.incubrain-link:hover::after {
  width: 100%;
}

/* Heart animation */
@keyframes heartbeat {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.animate-heartbeat {
  animation: heartbeat 1.5s ease-in-out infinite;
}
</style>
