<template>
  <div class="mx-auto w-full">
    <div class="relative md:block flex flex-col overflow-hidden">
      <div>
        <div
          class="md:w-2/5 w-full min-h-full text-left md:justify-center md:text-right md:absolute flex flex-col items-start md:items-end right-0 lg:gap-10 z-30 md:bg-gradient-to-r from-transparent dark:to-zinc-900 dark:via-zinc-900 via-white to-white p-4 lg:px-8 lg:py-12"
        >
          <div class="md:w-96">
            <h1 class="text-2xl font-bold leading-10 sm:text-4xl md:text-5xl pb-2"> LET’S TALK </h1>
            <p class="py-4 text-base leading-normal md:mt-2">
              We'll happily answer any questions <br />you have about AstronEra / AstroTribe
            </p>
          </div>
          <div class="md:max-w-48 flex flex-col gap-3">
            <div class="space-y-1">
              <h3 class="text-xl font-semibold"> Email </h3>
              <NuxtLink
                to="mailto:connectus@astronera.org"
                target="_blank"
              >
                connectus@astronera.org
              </NuxtLink>
            </div>
            <div class="space-y-1">
              <h3 class="text-xl font-semibold"> Phone </h3>
              <NuxtLink
                to="tel: +91-880-610-7510"
                target="_blank"
              >
                +91 880 610 7510
              </NuxtLink>
            </div>
            <div class="space-y-1">
              <h3 class="text-xl font-semibold"> Address </h3>
              <p>
                Prachi, 392/6B, Atreya Soc., Deep Bangla Chowk, Model Colony, Pune, Maharashtra
                411016
              </p>
            </div>
          </div>
          <SocialBlock :socials="socials" />
        </div>
      </div>
      <iframe
        id="iframe"
        :style="
          color.value === 'dark' ? { filter: ' grayscale(100%) invert(92%) contrast(83%)' } : {}
        "
        class="block right-0 top-0 w-full min-h-[600px] md:min-h-screen"
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15132.046394090614!2d73.831345!3d18.528378!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf781273177b%3A0x748518923253f332!2sAstron%20Era!5e0!3m2!1sen!2sin!4v1687445031830!5m2!1sen!2sin"
        style="border: 0"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import socials from '@/data/home/socials.json'
const color = useColorMode()

const contactData = {
  Email: '',
  Phone: '',
  Location: ''
}

definePageMeta({
  name: 'Contact'
})
</script>

<style scoped>
@media (max-width: 768px) {
  #iframe {
    height: 50vh !important;
  }
}
</style>
