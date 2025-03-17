<script setup lang="ts">
defineProps({
  astroguide: {
    type: Object,
    required: true,
  },
})

const capitalizeWords = (prop: string) =>
  prop
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
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
    <template #header>
      <div class="p-2">
        <div class="absolute left-0 top-0 z-10 hidden h-full w-full bg-black/10 visible" />
        <IBImage
          :img="{
            src: `/images/astroguides/${astroguide.avatar}.jpg`,
            alt: `${astroguide.given_name} ${astroguide.surname}`,
            width: '350',
            height: '350',
            loading: 'lazy',
            quality: '80',
            format: 'webp',
          }"
          class="astroguide w-full object-cover grayscale-[20%] rounded-t-xl overflow-hidden"
        />
      </div>
    </template>
    <div class="p-6 flex flex-col justify-between flex-grow min-h-full">
      <div class="flex flex-col flex-grow gap-4 text-sm pb-4">
        <h3 class="text-2xl font-semibold">
          {{ astroguide.given_name }} {{ astroguide.surname }}
        </h3>
        <p class="flex items-center gap-2 font-semibold text-primary-300">
          <Icon
            name="mdi:account"
            class="flex-shrink-0"
            size="24px"
          />
          {{ astroguide.professional_title }}
        </p>
        <p
          v-if="astroguide.locality"
          class="flex items-center gap-2 font-semibold text-primary-300"
        >
          <Icon
            name="uil:location-point"
            class="flex-shrink-0"
            size="24px"
          />
          {{ astroguide.locality }}
        </p>
        <template
          v-for="field in [
            'astronomy_knowledge',
            'telescope_handling',
            'english_fluency',
            'marathi_hindi_fluency',
            'stargazing',
            'communication_skills',
            'overall_rating',
          ]"
        >
          <p
            v-if="astroguide[field]"
            :key="`${astroguide.given_name}_${field}`"
            class="flex items-center"
          >
            {{ capitalizeWords(field) }}:
            <Icon
              v-for="(_, index) in Array(Math.floor(astroguide[field]))"
              :key="`${astroguide.given_name}_${field}_full_${index}`"
              name="mdi:star"
              class="text-yellow-500"
            />
            <!-- Half star if there's a significant decimal -->
            <Icon
              v-if="astroguide[field] % 1 >= 0.5"
              :key="`${astroguide.given_name}_${field}_half`"
              name="mdi:star-half-full"
              class="text-yellow-500"
            />
          </p>
        </template>
        <p v-if="astroguide.events_done">Events Done: {{ astroguide.events_done }}</p>
      </div>
    </div>
  </LandingGlass>
</template>

<style scoped>
.astroguide {
  transform: rotate(-90deg);
}
</style>
