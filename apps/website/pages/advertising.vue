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
  preferredDate: null,
  message: '',
})

const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref(false)
const errorMessage = ref('')

// Initialize toast notification (if you want to use it)
const toast = useToast()

// Form submission
const submitForm = async () => {
  isSubmitting.value = true
  submitSuccess.value = false
  submitError.value = false
  errorMessage.value = ''

  try {
    // Send form data to the server API endpoint
    const { data } = await useFetch('/api/contact', {
      method: 'POST',
      body: formData.value,
    })

    // Check the response
    if (data.value?.success) {
      submitSuccess.value = true

      // Reset form
      formData.value = {
        name: '',
        company: '',
        email: '',
        phone: '',
        website: '',
        preferredDate: '',
        message: '',
      }

      // Optional: Show toast notification
      toast.add({
        severity: 'success',
        summary: 'Request Submitted',
        detail: "We'll be in touch within 24 hours!",
        life: 5000,
      })
    } else {
      submitError.value = true
      errorMessage.value = data.value?.message || 'Something went wrong'

      // Optional: Show toast notification
      toast.add({
        severity: 'error',
        summary: 'Submission Failed',
        detail: errorMessage.value,
        life: 5000,
      })
    }
  } catch (error: any) {
    console.error('Form submission error:', error)
    submitError.value = true
    errorMessage.value = 'Network error. Please try again later.'

    // Optional: Show toast notification
    toast.add({
      severity: 'error',
      summary: 'Network Error',
      detail: 'Please try again or contact us directly.',
      life: 5000,
    })
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
              Write to Us
              <Icon
                name="i-lucide-mail"
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

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <LandingGlass
          hover-effect="glow"
          glow-color="purple"
          gradient="mixed"
          intensity="low"
          interactive
          isolate-content
        >
          <div class="flex flex-col items-center text-center gap-4">
            <Icon
              name="i-lucide-users"
              size="48"
              class="text-primary-400"
            />
            <h3 class="text-xl font-bold">Targeted Audience</h3>
            <p
              >Connect with our community of astronomy enthusiasts actively searching for stargazing
              experiences, largely focused in and around Pune and Mumbai area.</p
            >
          </div>
        </LandingGlass>

        <LandingGlass
          hover-effect="glow"
          glow-color="purple"
          gradient="mixed"
          intensity="low"
          interactive
          isolate-content
        >
          <div class="flex flex-col items-center text-center gap-4">
            <Icon
              name="i-lucide-star"
              size="48"
              class="text-primary-400"
            />
            <h3 class="text-xl font-bold">Premium Visibility</h3>
            <p
              >Featured placement on our website as well as social media platforms for maximum
              exposure to leads interested in astronomy events.</p
            >
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

          <div class="flex flex-col items-center text-center gap-4">
            <div
              class="w-16 h-16 rounded-full bg-primary-700 flex items-center justify-center text-white text-2xl font-bold"
              >1</div
            >
            <h3 class="text-xl font-bold">Write to Us</h3>
            <p
              >Email us at connectus@astronera.org to understand your unique offerings and goals.</p
            >
          </div>

          <div class="flex flex-col items-center text-center gap-4">
            <div
              class="w-16 h-16 rounded-full bg-primary-700 flex items-center justify-center text-white text-2xl font-bold"
              >2</div
            >
            <h3 class="text-xl font-bold">We Create Your Profile</h3>
            <p>Professional showcase of your stargazing experiences and events.</p>
          </div>

          <div class="flex flex-col items-center text-center gap-4">
            <div
              class="w-16 h-16 rounded-full bg-primary-700 flex items-center justify-center text-white text-2xl font-bold"
              >3</div
            >
            <h3 class="text-xl font-bold">Start Receiving Bookings</h3>
            <p>Customers discover and book directly with you.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Package Details Section -->
    <div class="wrapper py-20">
      <LandingTitle
        title="Boost Your Brand with AstronEra"
        subtitle="Let's help each other grow!"
      />

      <div class="max-w-4xl mx-auto mt-8 mb-12 text-center">
        <p class="text-lg"
          >Collaborate with AstronEra to reach a highly engaged, space-loving community. Whether
          you're hosting a science event, launching a product, or building a brand—our audience is
          your audience.</p
        >
      </div>

      <h3 class="text-2xl font-bold text-center mb-6 text-primary-400">Why AstronEra?</h3>
      <div class="max-w-2xl mx-auto mb-12">
        <ul class="space-y-2">
          <li class="flex items-start gap-2">
            <Icon
              name="i-lucide-check-circle"
              class="text-primary-400 mt-1 flex-shrink-0"
            />
            <p
              ><span class="font-bold">Wider Audience Reach</span> – We have a dedicated community
              of astronomy lovers who are always on the lookout for exciting events.</p
            >
          </li>
          <li class="flex items-start gap-2">
            <Icon
              name="i-lucide-check-circle"
              class="text-primary-400 mt-1 flex-shrink-0"
            />
            <p
              ><span class="font-bold">More Sign-ups for Your Events</span> – Our promotions will
              help attract the right audience to your stargazing experiences.</p
            >
          </li>
          <li class="flex items-start gap-2">
            <Icon
              name="i-lucide-check-circle"
              class="text-primary-400 mt-1 flex-shrink-0"
            />
            <p
              ><span class="font-bold">Cost-Effective Marketing</span> – You get exposure at an
              affordable price while also benefiting from discounts through mutual support.</p
            >
          </li>
        </ul>
      </div>

      <h3 class="text-2xl font-bold text-center mb-6">Choose Your Package</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <LandingGlass
          hover-effect="glow"
          glow-color="purple"
          gradient="mixed"
          intensity="medium"
          interactive
          isolate-content
        >
          <div class="text-center mb-4">
            <h2 class="text-2xl font-bold mb-2">Standard Package</h2>
            <p class="text-xl font-bold text-primary-400">₹1500 for 2 Weeks</p>
          </div>

          <p class="mb-4"
            >Perfect for local events, workshops, or science-based brands looking for solid
            visibility.</p
          >

          <div class="space-y-3 mb-6">
            <div class="flex items-start gap-3">
              <Icon
                name="i-lucide-instagram"
                size="24"
                class="text-primary-400 flex-shrink-0"
              />
              <div>
                <p>5 Instagram stories</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <Icon
                name="i-lucide-share-2"
                size="24"
                class="text-primary-400 flex-shrink-0"
              />
              <div>
                <p>2 dedicated posts across Instagram, LinkedIn, and Twitter (X)</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <Icon
                name="i-lucide-message-circle"
                size="24"
                class="text-primary-400 flex-shrink-0"
              />
              <div>
                <p>1 WhatsApp broadcast to our curated community</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <Icon
                name="i-lucide-mail"
                size="24"
                class="text-primary-400 flex-shrink-0"
              />
              <div>
                <p>1 email campaign to all our subscribers</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <Icon
                name="i-lucide-video"
                size="24"
                class="text-primary-400 flex-shrink-0"
              />
              <div>
                <p>1 reel (provided by client) promotion on YouTube/Instagram</p>
              </div>
            </div>
          </div>

          <div class="text-center">
            <PrimeButton
              class="bg-primary-600 hover:bg-primary-700 px-6 py-3"
              @click="$scrollTo('#contact-form')"
            >
              Get Started
            </PrimeButton>
          </div>
        </LandingGlass>

        <LandingGlass
          hover-effect="glow"
          glow-color="purple"
          gradient="mixed"
          intensity="medium"
          interactive
          isolate-content
        >
          <div class="text-center mb-4">
            <h2 class="text-2xl font-bold mb-2">Premium Package</h2>
            <p class="text-xl font-bold text-primary-400">₹3000 for 2 Weeks</p>
            <p class="text-sm text-primary-300 mt-1">(Coming Soon)</p>
          </div>

          <p class="mb-4"
            >Designed for serious visibility and growth. Ideal for long-term promotions, launches,
            and brand partnerships.</p
          >

          <p class="mb-4"><strong>Everything in Standard, plus:</strong></p>

          <div class="space-y-3 mb-6">
            <div class="flex items-start gap-3">
              <Icon
                name="i-lucide-newspaper"
                size="24"
                class="text-primary-400 flex-shrink-0"
              />
              <div>
                <p>Inclusion in our newsletter</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <Icon
                name="i-lucide-bar-chart-2"
                size="24"
                class="text-primary-400 flex-shrink-0"
              />
              <div>
                <p>Detailed analytics post-campaign</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <Icon
                name="i-lucide-file-text"
                size="24"
                class="text-primary-400 flex-shrink-0"
              />
              <div>
                <p>Dedicated profile page on our website</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <Icon
                name="i-lucide-users"
                size="24"
                class="text-primary-400 flex-shrink-0"
              />
              <div>
                <p>Priority customer referrals</p>
              </div>
            </div>
          </div>

          <div class="text-center">
            <p class="text-sm mb-2">Coming Soon</p>
            <PrimeButton
              class="bg-primary-700 hover:bg-primary-800 px-6 py-3"
              disabled
            >
              Available Soon
            </PrimeButton>
          </div>
        </LandingGlass>
      </div>

      <div class="text-center mt-8">
        <p class="text-lg"
          >Let's collaborate and make space for your brand in the minds of the right audience!</p
        >
        <p class="text-primary-400 mt-2"
          >📩 Write to us at connectus@astronera.org to get started.</p
        >
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
          value="0"
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
            <h3 class="text-lg font-semibold">How many leads can I expect from the promotion?</h3>
          </PrimeAccordionHeader>
          <PrimeAccordionContent>
            <p class="p-2"
              >While results vary based on your offering and seasonality, our partners typically see
              15-25 leads during the two-week promotion period. Many report a 15-20% conversion rate
              from these targeted prospects.</p
            >
          </PrimeAccordionContent>
        </PrimeAccordionPanel>

        <PrimeAccordionPanel
          value="1"
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
            <h3 class="text-lg font-semibold">Do you handle the bookings for my events?</h3>
          </PrimeAccordionHeader>
          <PrimeAccordionContent>
            <p class="p-2"
              >No, we connect interested customers directly with you. This allows you to maintain
              full control over your booking process, pricing, and customer relationship. We simply
              provide the high-quality leads.</p
            >
          </PrimeAccordionContent>
        </PrimeAccordionPanel>

        <PrimeAccordionPanel
          value="2"
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
            <h3 class="text-lg font-semibold"
              >What information do you need from me to get started?</h3
            >
          </PrimeAccordionHeader>
          <PrimeAccordionContent>
            <p class="p-2"
              >We'll need details about your stargazing experiences, high-quality images, location
              information, pricing, and what makes your offering unique. When you write to us, we'll
              guide you through exactly what will make your listing most effective.</p
            >
          </PrimeAccordionContent>
        </PrimeAccordionPanel>

        <PrimeAccordionPanel
          value="3"
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
            <h3 class="text-lg font-semibold"
              >Can I extend my promotion beyond the initial 2 weeks?</h3
            >
          </PrimeAccordionHeader>
          <PrimeAccordionContent>
            <p class="p-2"
              >Absolutely! Many partners choose to extend their promotion after seeing the results
              from the initial period. We offer flexible extension options at preferential rates for
              existing partners.</p
            >
          </PrimeAccordionContent>
        </PrimeAccordionPanel>

        <PrimeAccordionPanel
          value="4"
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
            <h3 class="text-lg font-semibold">How quickly can my promotion go live?</h3>
          </PrimeAccordionHeader>
          <PrimeAccordionContent>
            <p class="p-2"
              >After we receive all necessary materials, we typically launch promotions within 3-5
              business days. We'll work with you to find the optimal timing based on astronomical
              events and seasonal trends.</p
            >
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
          subtitle="Get in touch with our team"
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
              There was an error submitting your request. Please try again or contact us directly at
              connectus@astronera.org.
            </div>

            <!-- Submit Button -->
            <div class="text-center">
              <PrimeButton
                type="submit"
                label="Submit Your Information"
                icon="i-lucide-send"
                icon-pos="right"
                class="bg-primary-600 hover:bg-primary-700 px-6 py-3 text-lg"
                :loading="isSubmitting"
              />
            </div>
          </form>
        </LandingGlass>
      </div>
    </div>
  </div>
</template>
