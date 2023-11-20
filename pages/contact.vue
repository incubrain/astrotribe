<template>
  <div class="mx-auto w-full">
    <div class="relative lg:block flex flex-col overflow-hidden">
      <div>
        <div
          class="lg:w-2/5 w-full min-h-full text-center lg:justify-center lg:text-right lg:absolute flex flex-col items-center lg:items-end lg:pr-8 right-0 gap-10 z-30 lg:bg-gradient-to-r from-transparent dark:to-zinc-900 dark:via-zinc-900 via-white to-white lg:pl-6 py-4 sm:py-10 lg:py-20"
        >
          <div class="lg:w-96">
            <h1 class="text-2xl font-bold leading-10 sm:text-4xl lg:text-5xl pb-2"> LET’S TALK </h1>
            <p class="mt-4 text-base leading-normal lg:mt-2">
              We'll happily answer any questions <br />you have about AstronEra / AstroTribe
            </p>
          </div>
          <div
            v-for="(contact, i) in contactData"
            :key="`contact-item-${i}`"
            class="pb-3 space-y-1"
          >
            <h3 class="text-xl font-semibold">
              {{ i }}
            </h3>
            <p>
              {{ contact }}
            </p>
          </div>
          <SocialBlock :socials="socials" />
        </div>
      </div>
      <iframe
        id="iframe"
        :style="
          color.value === 'dark' ? { filter: ' grayscale(100%) invert(92%) contrast(83%)' } : {}
        "
        class="block right-0 top-0 w-full min-h-[600px] lg:min-h-[calc(100vh-var(--nav-height-lg))]"
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15132.046394090614!2d73.831345!3d18.528378!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf781273177b%3A0x748518923253f332!2sAstron%20Era!5e0!3m2!1sen!2sin!4v1687445031830!5m2!1sen!2sin"
        style="border: 0"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import contactData from '@/data/home/contact.json'
import socials from '@/data/home/socials.json'
const color = useColorMode()

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
