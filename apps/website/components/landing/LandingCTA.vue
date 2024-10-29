<script setup lang="ts">
import { onMounted } from 'vue'
import { useAnimation } from '~/composables/useAnimation'
import { useRuntimeConfig } from '#app'

const { fadeInLeft, fadeInRight } = useAnimation()

defineProps<{
  title: string
  subtitle: string
  buttonText: string
}>()

const config = useRuntimeConfig()
const authLink = config.public.aeAuthLink

onMounted(() => {
  fadeInLeft('.cta-content')
  fadeInRight('.cta-image')
})
</script>

<template>
  <section class="cta-section relative py-32">
    <div
    class="absolute inset-0 -z-10 h-full w-full bg-gradient-to-b from-transparent from-10% via-primary-950 via-50% to-transparent to-90%"
    ></div>

    <div class="flex flex-col md:flex-row items-center justify-between">
      <div class="cta-content text-white md:w-1/2 mb-8 md:mb-0">
        <h2 class="text-2xl md:text-3xl font-bold mb-4 font-space">
          {{ title }}
        </h2>
        <p class="text-xl mb-8">{{ subtitle }}</p>
        <NuxtLink
          :to="authLink"
          class="inline-block"
        >
          <PrimeButton
            :label="buttonText"
            severity="secondary"
            size="large"
          />
        </NuxtLink>
      </div>
      <div class="md:w-1/2 cta-image">
        <NuxtImg
          src="https://picsum.photos/800/600"
          alt="CTA Image"
          class="rounded-lg w-full h-auto shadow-2xl shadow-black"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.bg-gradient-to-b {
  background-image: linear-gradient(
    to bottom,
    rgba(1, 34, 63, 0) 0%,
    rgba(1, 34, 63, 1) 50%,
    rgba(1, 34, 63, 0) 100%
  );
}
</style>
