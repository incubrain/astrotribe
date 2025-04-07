<template>
  <div class="mx-auto w-full">
    <!-- Hero section with space-themed background -->
    <IBImageHero
      :img="{
        src: '/images/contact/contact-hero.jpg',
        alt: 'AstronEra contact page hero image showing a telescope pointed at a starry night sky',
        width: 1920,
        height: 1080,
      }"
      :title="{
        main: 'LET\'S TALK',
        subtitle: 'We\'ll happily answer any questions you have about AstronEra',
        centered: true,
      }"
      fit="cover"
      object-position="object-center"
    />

    <div class="wrapper py-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Contact Form Column -->
        <div class="lg:col-span-5 space-y-6">
          <IBGlass
            hover-effect="glow"
            glow-color="blue"
            gradient="blue"
            intensity="low"
            interactive
            class="p-6"
          >
            <h2 class="text-2xl font-bold mb-6 text-white">Send Us a Message</h2>

            <form
              class="space-y-4"
              @submit.prevent="submitForm"
            >
              <!-- Name Field -->
              <div class="space-y-2">
                <label
                  for="name"
                  class="block text-sm font-medium text-primary-200"
                  >Your Name</label
                >
                <PrimeInputText
                  id="name"
                  v-model="formData.name"
                  class="w-full"
                  placeholder="Enter your name"
                />
              </div>

              <!-- Email Field -->
              <div class="space-y-2">
                <label
                  for="email"
                  class="block text-sm font-medium text-primary-200"
                  >Email Address</label
                >
                <PrimeInputText
                  id="email"
                  v-model="formData.email"
                  class="w-full"
                  placeholder="Enter your email"
                />
              </div>

              <!-- Inquiry Type Field -->
              <div class="space-y-2">
                <label
                  for="inquiryType"
                  class="block text-sm font-medium text-primary-200"
                  >Reason for Contact</label
                >
                <PrimeSelect
                  id="inquiryType"
                  v-model="formData.inquiryType"
                  :options="inquiryOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Select a reason"
                  class="w-full"
                />
              </div>

              <!-- Message Field -->
              <div class="space-y-2">
                <label
                  for="message"
                  class="block text-sm font-medium text-primary-200"
                  >Message</label
                >
                <PrimeTextarea
                  id="message"
                  v-model="formData.message"
                  rows="5"
                  class="w-full"
                  placeholder="How can we help you?"
                />
              </div>

              <!-- Submit Button -->
              <div class="pt-2">
                <PrimeButton
                  type="submit"
                  severity="primary"
                  class="w-full md:w-auto"
                  :loading="isSubmitting"
                >
                  <Icon
                    name="mdi:send"
                    class="mr-2"
                  />
                  Send Message
                </PrimeButton>
              </div>
            </form>
          </IBGlass>

          <!-- FAQ Section -->
          <IBGlass
            hover-effect="glow"
            glow-color="purple"
            gradient="purple"
            intensity="low"
            interactive
            class="p-6"
          >
            <h2 class="text-2xl font-bold mb-6 text-white">Frequently Asked Questions</h2>

            <PrimeAccordion class="faq-accordion">
              <PrimeAccordionTab header="What services does AstronEra offer?">
                <p
                  >AstronEra offers astronomy education, dark sky conservation initiatives, and
                  specialized astro-tourism experiences. We also organize conferences, workshops,
                  and training programs for students and professionals.</p
                >
              </PrimeAccordionTab>

              <PrimeAccordionTab header="How can I join one of your workshops?">
                <p
                  >You can register for our workshops through the Events section of our website.
                  Upcoming workshops are listed with registration details and requirements.</p
                >
              </PrimeAccordionTab>

              <PrimeAccordionTab header="Do you offer telescope training?">
                <p
                  >Yes, we regularly conduct telescope handling and stargazing workshops. Check our
                  Events page for upcoming telescope training sessions.</p
                >
              </PrimeAccordionTab>
            </PrimeAccordion>
          </IBGlass>
        </div>

        <!-- Contact Information Column -->
        <div class="lg:col-span-7 space-y-6">
          <!-- Contact Info Card -->
          <IBGlass
            hover-effect="glow"
            glow-color="blue"
            gradient="mixed"
            intensity="low"
            interactive
            class="p-6"
          >
            <h2 class="text-2xl font-bold mb-6 text-white">Connect With Us</h2>

            <div class="space-y-6">
              <!-- Email -->
              <div class="flex items-start">
                <div
                  class="flex-shrink-0 p-2 bg-primary-800 rounded-full mr-4 flex items-center justify-center"
                >
                  <Icon
                    name="mdi:email"
                    class="text-primary-400"
                    size="24px"
                  />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-primary-200">Email</h3>
                  <a
                    href="mailto:connectus@astronera.org"
                    class="text-white hover:text-primary-400 transition-colors"
                  >
                    connectus@astronera.org
                  </a>
                  <p class="text-xs text-primary-300 mt-1">We typically respond within 24 hours</p>
                </div>
              </div>

              <!-- Phone -->
              <div class="flex items-start">
                <div
                  class="flex-shrink-0 p-2 bg-primary-800 rounded-full mr-4 flex items-center justify-center"
                >
                  <Icon
                    name="mdi:phone"
                    class="text-primary-400"
                    size="24px"
                  />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-primary-200">Phone</h3>
                  <a
                    href="tel:+918806107510"
                    class="text-white hover:text-primary-400 transition-colors"
                  >
                    +91 880 610 7510
                  </a>
                  <p class="text-xs text-primary-300 mt-1"
                    >Available Mon-Fri, 10:00 AM - 6:00 PM IST</p
                  >
                </div>
              </div>

              <!-- Address -->
              <div class="flex items-start">
                <div
                  class="flex-shrink-0 p-2 bg-primary-800 rounded-full mr-4 flex items-center justify-center"
                >
                  <Icon
                    name="mdi:map-marker"
                    class="text-primary-400"
                    size="24px"
                  />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-primary-200">Address</h3>
                  <p class="text-white">
                    Prachi, 392/6B, Atreya Soc., Deep Bangla Chowk,<br />
                    Model Colony, Pune, Maharashtra 411016
                  </p>
                  <a
                    href="https://maps.app.goo.gl/m4mY8ChLWpLbXhA98"
                    target="_blank"
                    class="inline-flex items-center text-primary-400 hover:text-primary-300 mt-2 text-sm"
                  >
                    <Icon
                      name="mdi:directions"
                      class="mr-1"
                    />
                    Get Directions
                  </a>
                </div>
              </div>
            </div>

            <!-- Social Media Links -->
            <div class="mt-8">
              <h3 class="text-lg font-semibold text-primary-200 mb-4">Follow Us</h3>
              <div class="flex space-x-4">
                <a
                  href="#"
                  target="_blank"
                  class="p-2 bg-primary-800 rounded-full text-primary-400 hover:text-white hover:bg-primary-700 transition-colors flex items-center justify-center"
                >
                  <Icon
                    name="mdi:twitter"
                    size="22px"
                  />
                </a>
                <a
                  href="#"
                  target="_blank"
                  class="p-2 bg-primary-800 rounded-full text-primary-400 hover:text-white hover:bg-primary-700 transition-colors flex items-center justify-center"
                >
                  <Icon
                    name="mdi:linkedin"
                    size="22px"
                  />
                </a>
                <a
                  href="#"
                  target="_blank"
                  class="p-2 bg-primary-800 rounded-full text-primary-400 hover:text-white hover:bg-primary-700 transition-colors flex items-center justify-center"
                >
                  <Icon
                    name="mdi:youtube"
                    size="22px"
                  />
                </a>
                <a
                  href="#"
                  target="_blank"
                  class="p-2 bg-primary-800 rounded-full text-primary-400 hover:text-white hover:bg-primary-700 transition-colors flex items-center justify-center"
                >
                  <Icon
                    name="mdi:facebook"
                    size="22px"
                  />
                </a>
                <a
                  href="#"
                  target="_blank"
                  class="p-2 bg-primary-800 rounded-full text-primary-400 hover:text-white hover:bg-primary-700 transition-colors flex items-center justify-center"
                >
                  <Icon
                    name="mdi:instagram"
                    size="22px"
                  />
                </a>
              </div>
            </div>
          </IBGlass>

          <!-- Map Card - Now spans full width on this column -->
          <IBGlass
            hover-effect="glow"
            glow-color="blue"
            gradient="blue"
            intensity="low"
            interactive
            :padded="false"
            class="overflow-hidden"
          >
            <div class="p-4 bg-primary-800/70">
              <h3 class="text-lg font-semibold text-white">Our Location</h3>
            </div>

            <div class="relative">
              <iframe
                loading="lazy"
                class="w-full h-80"
                style="filter: grayscale(80%) invert(92%) contrast(83%)"
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15132.046394090614!2d73.831345!3d18.528378!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf781273177b%3A0x748518923253f332!2sAstron%20Era!5e0!3m2!1sen!2sin!4v1687445031830!5m2!1sen!2sin"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>

              <div
                class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary-900 p-3 text-center"
              >
                <a
                  href="https://maps.app.goo.gl/m4mY8ChLWpLbXhA98"
                  target="_blank"
                  class="text-primary-400 hover:text-primary-300 text-sm inline-flex items-center"
                >
                  <Icon
                    name="mdi:open-in-new"
                    class="mr-1"
                    size="16px"
                  />
                  View Larger Map
                </a>
              </div>
            </div>
          </IBGlass>

          <!-- Schedule a Call Card -->
          <IBGlass
            hover-effect="glow"
            glow-color="purple"
            gradient="mixed"
            intensity="low"
            interactive
            class="p-6 text-center"
          >
            <h3 class="text-xl font-semibold text-white mb-3">Need a Personal Consultation?</h3>
            <p class="text-primary-200 mb-4">Schedule a video call with our astronomy experts</p>
            <PrimeButton severity="secondary">
              <Icon
                name="mdi:calendar-clock"
                class="mr-2"
              />
              Book a Call
            </PrimeButton>
          </IBGlass>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 1. Imports
import { ref } from 'vue'
import type { Ref } from 'vue'

// 2. Page/Layout Metadata
definePageMeta({
  name: 'Contact',
})

// 3. Component Options
defineOptions({
  name: 'ContactPage',
})

// Set page title and metadata
useHead({
  title: 'Contact Us - AstronEra',
  meta: [
    {
      name: 'description',
      content:
        'Get in touch with the AstronEra team for inquiries about astronomy education, workshops, or collaborations.',
    },
  ],
})

// 7. Reactive Variables
const isSubmitting: Ref<boolean> = ref(false)

const formData = ref({
  name: '',
  email: '',
  inquiryType: '',
  message: '',
})

const inquiryOptions = ref([
  { label: 'General Inquiry', value: 'general' },
  { label: 'Workshop Registration', value: 'workshop' },
  { label: 'Collaboration Opportunity', value: 'collaboration' },
  { label: 'Press/Media', value: 'media' },
  { label: 'Feedback', value: 'feedback' },
])

// 11. Methods
const submitForm = () => {
  isSubmitting.value = true

  // Simulate API call
  setTimeout(() => {
    isSubmitting.value = false

    // Show success message
    const toast = useNotification()
    toast.success({
      summary: 'Message Sent',
      message: "Your message has been sent! We'll get back to you soon.",
    })

    // Reset form
    formData.value = {
      name: '',
      email: '',
      inquiryType: '',
      message: '',
    }
  }, 1500)
}
</script>

<style scoped>
@keyframes twinkle {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

:deep(.faq-accordion) .p-accordion-header-link {
  background-color: rgba(30, 41, 59, 0.5) !important;
  border-color: rgba(99, 102, 241, 0.2) !important;
  color: white !important;
}

:deep(.faq-accordion) .p-accordion-header-link:hover {
  background-color: rgba(30, 41, 59, 0.8) !important;
}

:deep(.faq-accordion) .p-accordion-content {
  background-color: rgba(30, 41, 59, 0.3) !important;
  border-color: rgba(99, 102, 241, 0.2) !important;
  color: rgb(203, 213, 225) !important;
}
</style>
