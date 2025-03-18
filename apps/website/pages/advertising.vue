<script setup lang="ts">
import { ref } from 'vue'

// Testimonial data
const testimonials = [
  {
    name: 'Sarah Thompson',
    company: 'Cosmic Voyages',
    quote:
      'Partnering with AstronEra transformed our business. Within just two weeks, we saw a 40% increase in bookings for our stargazing tours. The targeted audience was exactly what we needed.',
    image: '/images/testimonials/sarah-thompson.jpg',
  },
  {
    name: 'Michael Rodriguez',
    company: 'StarGaze Adventures',
    quote:
      "The quality of leads we received through AstronEra was exceptional. These weren't just curious browsers, but dedicated astronomy enthusiasts ready to book our premium experiences.",
    image: '/images/testimonials/michael-rodriguez.jpg',
  },
  {
    name: 'Lakshmi Patel',
    company: 'Celestial Nights',
    quote:
      'The team at AstronEra truly understands the stargazing business. Their promotion highlighted exactly what makes our events special, attracting the perfect clientele for our guided tours.',
    image: '/images/testimonials/lakshmi-patel.jpg',
  },
]

// FAQ data
const faqs = [
  {
    question: 'How many leads can I expect from the promotion?',
    answer:
      'While results vary based on your offering and seasonality, our partners typically see 30-50 qualified leads during the two-week promotion period. Many report a 25-40% conversion rate from these highly targeted prospects.',
  },
  {
    question: 'Do you handle the bookings for my events?',
    answer:
      'No, we connect interested customers directly with you. This allows you to maintain full control over your booking process, pricing, and customer relationship. We simply provide the high-quality leads.',
  },
  {
    question: 'What information do you need from me to get started?',
    answer:
      "We'll need details about your stargazing experiences, high-quality images, location information, pricing, and what makes your offering unique. During our consultation, we'll guide you through exactly what will make your listing most effective.",
  },
  {
    question: 'Can I extend my promotion beyond the initial 2 weeks?',
    answer:
      'Absolutely! Many partners choose to extend their promotion after seeing the results from the initial period. We offer flexible extension options at preferential rates for existing partners.',
  },
  {
    question: 'How quickly can my promotion go live?',
    answer:
      "After our consultation and once we have all necessary materials, we typically launch promotions within 3-5 business days. We'll work with you to find the optimal timing based on astronomical events and seasonal trends.",
  },
]

// Form state
const formData = ref({
  name: '',
  company: '',
  email: '',
  phone: '',
  website: '',
  preferredDate: '',
  message: '',
})

const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref(false)

// Form submission
const submitForm = async () => {
  isSubmitting.value = true
  submitSuccess.value = false
  submitError.value = false

  try {
    // This would be replaced with your actual form submission logic
    await new Promise((resolve) => setTimeout(resolve, 1500))
    submitSuccess.value = true
    formData.value = {
      name: '',
      company: '',
      email: '',
      phone: '',
      website: '',
      preferredDate: '',
      message: '',
    }
  } catch (error) {
    console.error('Form submission error:', error)
    submitError.value = true
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div>
    <!-- Hero Section -->
    <div class="relative min-h-screen text-white w-full">
      <IBImage
        :img="{
          src: '/images/hero-image-startrail.jpg',
          alt: 'Deep space stargazing background',
          quality: '80',
          format: 'webp',
        }"
        class="absolute left-0 top-0 h-full w-full bg-center bg-no-repeat object-cover"
      />
      <div class="absolute left-0 top-0 z-10 h-full w-full bg-zinc-900/70" />
      <div
        class="relative mx-auto grid max-w-[1920px] gap-8 px-4 py-32 md:px-16 lg:grid-cols-[1.5fr_1.75fr] xl:gap-16 xl:px-32"
      >
        <!-- Hero Left -->
        <div
          class="relative z-50 flex h-full w-full flex-col items-center gap-8 text-center lg:items-start lg:text-left"
        >
          <SvgStars
            class="top-14 left-14"
            :size="24"
            svg-color="#6366f1"
          />
          <h1 class="max-w-lg text-4xl font-bold leading-tight lg:text-5xl">
            Boost Your Stargazing Business with AstronEra
          </h1>
          <p class="max-w-sm text-xl font-semibold">
            Reach thousands of astronomy enthusiasts actively looking for unique night sky
            experiences
          </p>
          <div>
            <PrimeButton
              class="bg-primary-600 hover:bg-primary-700 px-6 py-3 text-lg"
              @click="$scrollTo('#contact-form')"
            >
              Schedule a Consultation
              <Icon
                name="i-lucide-calendar"
                class="ml-2"
              />
            </PrimeButton>
          </div>
          <SvgStars
            class="bottom-14 right-0"
            :size="18"
            svg-color="#6366f1"
          />
        </div>
        <div class="relative z-50 mx-auto flex h-full w-full items-center justify-center">
          <IBImage
            :img="{
              src: '/images/telescope-workshop-2025.jpeg',
              alt: 'Professional stargazing event',
              format: 'webp',
              width: 600,
              height: 400,
            }"
            class="rounded-lg shadow-2xl"
          />
        </div>
      </div>
    </div>

    <!-- Value Proposition Section -->
    <div class="wrapper py-20">
      <LandingTitle
        title="Why Partner With AstronEra?"
        subtitle="Amplify your reach in the astronomy community"
      />

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <LandingGlass
          v-for="(benefit, index) in [
            {
              icon: 'i-lucide-users',
              title: 'Targeted Audience',
              description:
                'Connect with our community of 10,000+ astronomy enthusiasts actively searching for stargazing experiences.',
            },
            {
              icon: 'i-lucide-star',
              title: 'Premium Visibility',
              description:
                'Featured placement on our platform for maximum exposure to qualified leads interested in astronomy events.',
            },
            {
              icon: 'i-lucide-megaphone',
              title: 'Expert Promotion',
              description:
                'Professional presentation of your events tailored to attract the right customers who value quality experiences.',
            },
          ]"
          :key="index"
          hover-effect="glow"
          glow-color="purple"
          gradient="mixed"
          intensity="low"
          interactive
          isolate-content
        >
          <div class="flex flex-col items-center text-center gap-4">
            <Icon
              :name="benefit.icon"
              size="48"
              class="text-primary-400"
            />
            <h3 class="text-xl font-bold">{{ benefit.title }}</h3>
            <p>{{ benefit.description }}</p>
          </div>
        </LandingGlass>
      </div>
    </div>

    <!-- How It Works Section -->
    <div class="bg-primary-950 py-20">
      <div class="wrapper">
        <LandingTitle
          title="Simple 3-Step Process"
          subtitle="Getting started is easy"
        />

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 relative">
          <!-- Connection lines -->
          <div
            class="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-primary-700 -z-10"
          ></div>

          <div
            v-for="(step, index) in [
              {
                number: '1',
                title: 'Schedule a Consultation',
                description: 'Brief call to understand your unique offerings and goals.',
              },
              {
                number: '2',
                title: 'We Create Your Profile',
                description: 'Professional showcase of your stargazing experiences and events.',
              },
              {
                number: '3',
                title: 'Start Receiving Bookings',
                description: 'Customers discover and book directly with you.',
              },
            ]"
            :key="index"
            class="flex flex-col items-center text-center gap-4"
          >
            <div
              class="w-16 h-16 rounded-full bg-primary-700 flex items-center justify-center text-white text-2xl font-bold"
            >
              {{ step.number }}
            </div>
            <h3 class="text-xl font-bold">{{ step.title }}</h3>
            <p>{{ step.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Package Details Section -->
    <div class="wrapper py-20">
      <LandingGlass
        hover-effect="glow"
        glow-color="purple"
        gradient="mixed"
        intensity="medium"
        interactive
        isolate-content
        class="max-w-4xl mx-auto"
      >
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold mb-2">Premium Promotion Package</h2>
          <p class="text-xl font-bold text-primary-400">$1500 for 2 Weeks of Premium Exposure</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div
            v-for="(feature, index) in [
              {
                icon: 'i-lucide-layout-dashboard',
                title: 'Featured Homepage Placement',
                description:
                  'Prime visibility on our main page where most users begin their journey.',
              },
              {
                icon: 'i-lucide-file-text',
                title: 'Dedicated Profile Page',
                description:
                  'Comprehensive showcase of your services with beautiful imagery and compelling descriptions.',
              },
              {
                icon: 'i-lucide-mail',
                title: 'Newsletter Inclusion',
                description: 'Featured in our weekly newsletter sent to 8,000+ subscribers.',
              },
              {
                icon: 'i-lucide-share-2',
                title: 'Social Media Promotion',
                description: 'Dedicated posts across our social channels with over 15K followers.',
              },
              {
                icon: 'i-lucide-bar-chart-2',
                title: 'Detailed Analytics Report',
                description: 'Comprehensive metrics on views, engagement, and lead generation.',
              },
              {
                icon: 'i-lucide-users',
                title: 'Priority Customer Referrals',
                description:
                  'Direct recommendations to users searching for experiences in your area.',
              },
            ]"
            :key="index"
            class="flex items-start gap-3"
          >
            <Icon
              :name="feature.icon"
              size="24"
              class="text-primary-400 flex-shrink-0"
            />
            <div>
              <h3 class="font-bold">{{ feature.title }}</h3>
              <p class="text-sm">{{ feature.description }}</p>
            </div>
          </div>
        </div>

        <div class="text-center">
          <PrimeButton
            class="bg-primary-600 hover:bg-primary-700 px-6 py-3 text-lg"
            @click="$scrollTo('#contact-form')"
          >
            Get Started Today
            <Icon
              name="i-lucide-arrow-right"
              class="ml-2"
            />
          </PrimeButton>
        </div>
      </LandingGlass>
    </div>

    <!-- Testimonials Section -->
    <div class="bg-primary-950 py-20">
      <div class="wrapper">
        <LandingTitle
          title="Success Stories"
          subtitle="Hear from stargazing companies who partnered with us"
        />

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <LandingGlass
            v-for="(testimonial, index) in testimonials"
            :key="index"
            hover-effect="glow"
            glow-color="purple"
            gradient="mixed"
            intensity="low"
            interactive
            isolate-content
          >
            <div class="flex flex-col gap-4">
              <div class="flex items-start">
                <Icon
                  name="i-lucide-quote"
                  size="24"
                  class="text-primary-400 mr-2"
                />
                <p class="italic">{{ testimonial.quote }}</p>
              </div>
              <div class="flex items-center mt-4">
                <div class="w-12 h-12 rounded-full bg-primary-800 mr-4 overflow-hidden">
                  <img
                    :src="testimonial.image"
                    :alt="testimonial.name"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 class="font-bold">{{ testimonial.name }}</h4>
                  <p class="text-sm text-gray-400">{{ testimonial.company }}</p>
                </div>
              </div>
            </div>
          </LandingGlass>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="wrapper py-20 mx-auto">
      <LandingTitle
        title="Common Questions"
        subtitle="Everything you need to know about promoting with us"
      />

      <PrimeAccordion
        class="mt-12 justify-center items-center flex flex-col gap-4 max-w-2xl mx-auto"
      >
        <PrimeAccordionPanel
          v-for="(faq, index) in faqs"
          :key="index"
          :value="index"
          class="w-full"
        >
          <PrimeAccordionHeader
            class="flex flex-grow gap-4 bg-primary-800 py-2 rounded-md items-center justify-between min-w-full px-4 mx-auto"
          >
            <Icon
              name="i-lucide-help-circle"
              size="24"
              class="text-primary-400"
            />
            <h3 class="text-lg font-semibold">{{ faq.question }}</h3>
          </PrimeAccordionHeader>
          <PrimeAccordionContent>
            <p class="p-2">{{ faq.answer }}</p>
          </PrimeAccordionContent>
        </PrimeAccordionPanel>
      </PrimeAccordion>
    </div>

    <!-- Contact Form Section -->
    <div
      id="contact-form"
      class="bg-primary-950 py-20"
    >
      <div class="wrapper">
        <LandingTitle
          title="Ready to Boost Your Bookings?"
          subtitle="Schedule a consultation with our team"
        />

        <LandingGlass
          hover-effect="glow"
          glow-color="purple"
          gradient="mixed"
          intensity="low"
          interactive
          isolate-content
          class="max-w-2xl mx-auto mt-12"
        >
          <form
            class="space-y-6"
            @submit.prevent="submitForm"
          >
            <!-- Form Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  for="name"
                  class="block mb-2"
                  >Full Name *</label
                >
                <PrimeInputText
                  id="name"
                  v-model="formData.name"
                  required
                  class="w-full"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  for="company"
                  class="block mb-2"
                  >Company Name *</label
                >
                <PrimeInputText
                  id="company"
                  v-model="formData.company"
                  required
                  class="w-full"
                  placeholder="Your company"
                />
              </div>

              <div>
                <label
                  for="email"
                  class="block mb-2"
                  >Email Address *</label
                >
                <PrimeInputText
                  id="email"
                  v-model="formData.email"
                  required
                  type="email"
                  class="w-full"
                  placeholder="your.email@company.com"
                />
              </div>

              <div>
                <label
                  for="phone"
                  class="block mb-2"
                  >Phone Number</label
                >
                <PrimeInputText
                  id="phone"
                  v-model="formData.phone"
                  class="w-full"
                  placeholder="Your phone number"
                />
              </div>

              <div>
                <label
                  for="website"
                  class="block mb-2"
                  >Website</label
                >
                <PrimeInputText
                  id="website"
                  v-model="formData.website"
                  class="w-full"
                  placeholder="yourcompany.com"
                />
              </div>

              <div>
                <label
                  for="preferredDate"
                  class="block mb-2"
                  >Preferred Meeting Date</label
                >
                <PrimeDatePicker
                  id="preferredDate"
                  v-model="formData.preferredDate"
                  class="w-full"
                  placeholder="Select date"
                />
              </div>
            </div>

            <div>
              <label
                for="message"
                class="block mb-2"
                >Your Message</label
              >
              <PrimeTextarea
                id="message"
                v-model="formData.message"
                rows="4"
                class="w-full"
                placeholder="Tell us about your stargazing business and what you're looking for"
              />
            </div>

            <!-- Status Messages -->
            <div
              v-if="submitSuccess"
              class="bg-green-900/30 text-green-300 p-4 rounded"
            >
              Thank you! Your request has been submitted. We'll be in touch within 24 hours.
            </div>

            <div
              v-if="submitError"
              class="bg-red-900/30 text-red-300 p-4 rounded"
            >
              There was an error submitting your request. Please try again or contact us directly.
            </div>

            <!-- Submit Button -->
            <div class="text-center">
              <PrimeButton
                type="submit"
                class="bg-primary-600 hover:bg-primary-700 px-6 py-3 text-lg"
                :loading="isSubmitting"
              >
                <template #loading>
                  <Icon
                    name="i-lucide-loader"
                    class="animate-spin mr-2"
                  />
                  Submitting...
                </template>
                <template #default>
                  Schedule Your Consultation
                  <Icon
                    name="i-lucide-calendar"
                    class="ml-2"
                  />
                </template>
              </PrimeButton>
            </div>
          </form>
        </LandingGlass>
      </div>
    </div>

    <!-- Final CTA Section -->
    <div class="wrapper py-16 text-center">
      <h2 class="text-3xl font-bold mb-4">Ready to share the wonder of the night sky?</h2>
      <p class="text-xl mb-8 max-w-2xl mx-auto">
        Join AstronEra's network of premium stargazing providers and connect with passionate
        astronomy enthusiasts.
      </p>
      <PrimeButton
        class="bg-primary-600 hover:bg-primary-700 px-8 py-3 text-lg"
        @click="$scrollTo('#contact-form')"
      >
        Get Started Today
      </PrimeButton>
    </div>
  </div>
</template>
