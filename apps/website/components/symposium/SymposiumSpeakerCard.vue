<script setup lang="ts">
const isOpen = ref(false)

defineProps({
  speaker: {
    type: Object,
    required: true,
  },
  featured: {
    type: Boolean,
    required: false,
    default: false,
  },
})
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
            src: `/symposium/speakers/${speaker.avatar}.jpeg`,
            alt: `${speaker.given_name} will be presenting at the Dark Sky Conservation India Conference`,
            width: '350',
            height: '350',
            loading: 'lazy',
            quality: '80',
            format: 'webp',
          }"
          class="w-full object-cover grayscale-[20%] rounded-t-xl overflow-hidden"
        />
      </div>
    </template>
    <div class="p-6 flex flex-col justify-between flex-grow min-h-full">
      <div class="flex flex-col flex-grow gap-4 text-sm pb-4">
        <h3 class="text-2xl font-semibold">
          {{ speaker.title }} {{ speaker.given_name }} {{ speaker.surname }}
        </h3>
        <p class="flex items-center gap-2 font-semibold text-primary-600">
          <Icon
            name="mdi:account"
            class="flex-shrink-0"
            size="24px"
          />
          {{ speaker.professional_title }}
        </p>
        <p class="h-auto text-sm">
          {{ isOpen ? speaker.bio : speaker.bio.slice(0, 240) }}...
          <NuxtLink v-ripple
            ><PrimeButton
              outlined
              as="a"
              class="!p-0"
              @click="isOpen = !isOpen"
              >{{ isOpen ? 'Read Less' : 'Read More' }}</PrimeButton
            ></NuxtLink
          >
        </p>
      </div>
    </div>
  </LandingGlass>
</template>

<style scoped></style>
