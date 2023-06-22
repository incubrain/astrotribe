<template>
  <div class="mx-auto w-full min-h-[100vh]">
    <div class="relative md:block flex flex-col-reverse min-h-[100vh]">
      <iframe
        id="iframe"
        :style="
          color.value === 'dark' ? { filter: ' grayscale(100%) invert(92%) contrast(83%)' } : {}
        "
        class="w-full md:absolute right-0 h-full"
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15132.046394090614!2d73.831345!3d18.528378!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf781273177b%3A0x748518923253f332!2sAstron%20Era!5e0!3m2!1sen!2sin!4v1687445031830!5m2!1sen!2sin"
        width="600"
        height="450"
        style="border: 0"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
      <div class="min-h-[100vh]">
        <div
          class="lg:w-2/5 w-full min-h-[100vh] text-center md:text-right absolute flex flex-col items-center md:items-end pr-8 right-0 gap-10 z-30 bg-gradient-to-r from-transparent dark:to-zinc-900 dark:via-zinc-900 via-white to-white md:pl-6 py-4 sm:py-10 lg:py-40"
        >
          <div class="lg:w-96">
            <h1 class="text-2xl sm:text-4xl lg:text-5xl font-bold leading-10"> LET’S TALK </h1>
            <p class="text-base leading-normal mt-4 lg:mt-2">
              We'll happily answer any questions <br />you have about AstronEra / AstroTribe
            </p>
          </div>
          <FormContactDetail
            title="Office"
            :value="contactData.location.headquarters"
          />
          <FormContactDetail
            title="Phone"
            :value="contactData.phone"
          />
          <FormContactDetail
            title="Email"
            :value="contactData.email"
          />
          <SocialBlock />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import contactData from '@/data/home/contact.json'
const color = useColorMode()

definePageMeta({
  name: 'Contact',
  layout: 'home'
})
</script>

<style scoped>
@media (max-width: 768px) {
  #iframe {
    height: 50vh !important;
  }
}
</style>
