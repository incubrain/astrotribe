<script setup lang="ts">
const isOpen = ref(false)

const message = `Hi, I’m Tara the Firefly—your quirky little mascot for saving the dark skies!
  Why me? Well, as a firefly, I know the magic of natural light—I shine brightest when the night is dark and calm.
  But with all the harsh artificial lights around, not only are the stars disappearing, but it’s confusing creatures like me, disturbing humans’ sleep, and even affecting health!
  Protecting the night sky isn’t just for stargazing—it’s about keeping our planet in balance.
  That’s why I’m on a mission to fight light pollution, and I’m thrilled to see experts and policymakers joining forces at events like India's Dark Sky Policy and Sustainability Symposium.
  Together, we can turn down the glare and bring back the beauty of the night for everyone!`
</script>

<template>
  <div class="hidden md:flex z-50 fixed items-start bottom-5 right-5">
    <IBImage
      class="h-auto flex-shrink-0"
      :img="{
        src: '/images/mascot_tara.png',
        alt: 'Tara the Firefly',
        height: 200,
      }"
    />
    <div
      class="relative max-w-xs p-4 bg-black bg-opacity-70 border-2 border-black rounded-lg shadow-[0_0_15px_4px_rgba(255,215,0,0.4)]"
    >
      <p>
        {{ isOpen ? message : `${message.slice(0, 240)}...` }}
        <NuxtLink v-ripple
          ><PrimeButton
            outlined
            as="a"
            class="!p-0"
            @click="isOpen = !isOpen"
            >{{ isOpen ? 'Read Less' : 'Read More' }}</PrimeButton
          ></NuxtLink
        >
      </p></div
    >
  </div>
</template>
