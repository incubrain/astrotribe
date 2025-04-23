<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  astroguide: {
    type: Object,
    required: true,
  },
})

const popoverRef = ref()

const skills = [
  { key: 'astronomy_knowledge', icon: 'mdi:telescope', label: 'Astronomy' },
  { key: 'telescope_handling', icon: 'mdi:binoculars', label: 'Telescope' },
  { key: 'english_fluency', icon: 'mdi:alphabet-latin', label: 'English' },
  { key: 'marathi_hindi_fluency', icon: 'mdi:alphabetical', label: 'Marathi/Hindi' },
  { key: 'stargazing', icon: 'mdi:star', label: 'Stargazing' },
  { key: 'communication_skills', icon: 'mdi:message-text', label: 'Communication' },
]
</script>

<template>
  <LandingGlass
    hover-effect="glow"
    glow-color="purple"
    gradient="mixed"
    intensity="low"
    interactive
    isolate-content
    :padded="false"
    class="flex flex-col gap-2 relative h-full"
  >
    <!-- Avatar -->
    <template #header>
      <IBImage
        :img="{
          src: `/images/astroguides/${astroguide.avatar}.jpg`,
          alt: `${astroguide.given_name} ${astroguide.surname}`,
          width: '350px',
          height: '350px',
          format: 'webp',
        }"
        class="w-full h-56 object-fit grayscale-[10%] rounded-t-xl"
      />
    </template>

    <!-- Main Content -->
    <div class="p-4 flex flex-col gap-3">
      <!-- Name + Badge Summary -->
      <div>
        <h3 class="text-xl font-bold leading-tight">
          {{ astroguide.given_name }} {{ astroguide.surname }}
        </h3>
        <div class="flex gap-2 mt-2 flex-wrap">
          <PrimeBadge
            :value="`${astroguide.overall_rating}⭐ Overall`"
            class="bg-primary-700 text-white"
          />
          <PrimeBadge
            :value="`${astroguide.events_done} Events`"
            class="bg-primary-900 text-white"
          />
          <PrimeBadge
            :value="astroguide.locality"
            class="bg-primary-800 text-white"
          />
        </div>
      </div>

      <!-- Role -->
      <p class="flex items-center gap-2 text-sm text-primary-300 font-medium">
        <Icon name="mdi:account" />
        {{ astroguide.professional_title }}
      </p>

      <!-- Skill Icons (click to open Popover) -->
      <div class="flex flex-wrap items-center gap-2 mt-2">
        <template v-for="skill in skills">
          <PrimeButton
            v-if="astroguide[skill.key]"
            :key="skill.key"
            text
            severity="secondary"
            size="small"
            class="rounded-full border border-primary-700 bg-primary-950/60 text-primary-200"
            @click="popoverRef.toggle($event)"
          >
            <Icon
              :name="skill.icon"
              size="18px"
              class="mr-1"
            />
            <span class="text-xs">{{ skill.label }}</span>
          </PrimeButton>
        </template>
      </div>
    </div>

    <!-- Ratings Popover -->
    <PrimePopover ref="popoverRef">
      <div class="p-4 w-72">
        <h4 class="text-base font-semibold mb-3">Skill Ratings</h4>
        <ul class="space-y-2 text-sm text-primary-200">
          <li
            v-for="skill in skills"
            :key="skill.key"
            class="flex justify-between items-center"
          >
            <span class="flex gap-2 items-center">
              <Icon :name="skill.icon" />
              {{ skill.label }}
            </span>
            <span class="flex items-center gap-1">
              <Icon
                v-for="i in Math.floor(astroguide[skill.key])"
                :key="i"
                name="mdi:star"
                class="text-yellow-400"
              />
              <Icon
                v-if="astroguide[skill.key] % 1 >= 0.5"
                name="mdi:star-half-full"
                class="text-yellow-400"
              />
            </span>
          </li>
        </ul>
      </div>
    </PrimePopover>
  </LandingGlass>
</template>
