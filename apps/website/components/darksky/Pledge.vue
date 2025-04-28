<script setup lang="ts">
import { ref, reactive } from 'vue'
import * as z from 'zod'

// Form dialog visibility state
const isFormVisible = ref(false)
const isFormLoading = ref(false)
const formSuccessMessage = ref('')
const formErrorMessage = ref('')
const formTitle = ref('')
const currentTier = ref('')

// Define pledge tiers
const pledgeTiers = [
  {
    id: 'basic',
    amount: '1 LAKH INR',
    title: 'Star Steward',
    description: 'Help us take the first steps in fighting light pollution in India.',
    benefits: [
      'Fund 1 month of full-time advocacy work',
      'Support educational workshops in 5 local schools',
      'Sponsor dark sky awareness materials in local communities',
      'Your name listed on our supporters page',
      'Receive quarterly updates on our initiative progress',
    ],
    icon: 'mdi:star-outline',
  },
  {
    id: 'standard',
    amount: '5 LAKH INR',
    title: 'Galaxy Guardian',
    description: 'Make a significant impact on our dark sky conservation efforts.',
    benefits: [
      'Fund a part-time coordinator for 6 months',
      'Support development of light pollution monitoring stations in 2 cities',
      'Enable dark sky certification process for a local park or reserve',
      'Sponsor a community stargazing event with professional equipment',
      'Recognition in our annual dark sky report',
    ],
    icon: 'mdi:star-half-full',
    highlight: true,
  },
  {
    id: 'premium',
    amount: '10 LAKH+ INR',
    title: 'Universe Protector',
    description: "Lead the charge in transforming India's approach to night lighting.",
    benefits: [
      'Fund a full-time dark sky advocate for one year',
      'Support a complete dark sky friendly lighting retrofit for a public space',
      'Fund 50% of a dark sky reserve application and certification process',
      'Enable a comprehensive light pollution research study with local universities',
      'Sponsor a national-level dark sky conference with international experts',
    ],
    icon: 'mdi:star',
  },
]

// Form data for the pledge
const formData = reactive({
  name: '',
  email: '',
  phone: '',
  organization: '',
  message: '',
  pledgeAmount: '',
})

// Form validation schema
const formSchema = z.object({
  name: z.string().min(1, 'Please enter your name'),
  email: z.string().email('Please enter a valid email').min(1, 'Email is required'),
  phone: z.string().min(1, 'Please provide a contact number'),
  organization: z.string().optional(),
  message: z.string().optional(),
  pledgeAmount: z.string().min(1, 'Pledge amount is required'),
})

// Form validation resolver for PrimeForm
const formResolver = (values) => {
  try {
    formSchema.parse(values)
    return { values, errors: {} }
  } catch (error) {
    const errors = {}
    if (error.inner) {
      error.inner.forEach((e) => {
        errors[e.path] = e.message
      })
    }
    return { values, errors }
  }
}

// Handle tier selection and open form dialog
const selectTier = (tier) => {
  formData.pledgeAmount = tier.amount
  currentTier.value = tier.id
  formTitle.value = `Support the Dark Sky Initiative - ${tier.title}`
  isFormVisible.value = true
}

// Handle form submission
const handleSubmit = async (data) => {
  isFormLoading.value = true
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log('Form submitted:', data)
    formSuccessMessage.value =
      'Thank you for your pledge! We will contact you soon with payment details and further information.'

    // Reset form after 5 seconds and close dialog
    setTimeout(() => {
      formSuccessMessage.value = ''
      isFormVisible.value = false
      // Reset form data
      Object.keys(formData).forEach((key) => {
        if (key !== 'pledgeAmount') formData[key] = ''
      })
    }, 5000)
  } catch (error) {
    console.error('Submission error:', error)
    formErrorMessage.value =
      'There was an error processing your request. Please try again or contact us directly.'
  } finally {
    isFormLoading.value = false
  }
}

const { conf } = useAnimation()
const { stars, isClient } = useStarfield(30, 3)
</script>

<template>
  <section
    id="support-initiative"
    class="py-16 relative"
  >
    <!-- Background elements -->
    <div
      v-if="isClient"
      class="absolute inset-0 pointer-events-none overflow-hidden"
    >
      <!-- Stars background -->
      <div
        v-for="star in stars"
        :key="star.id"
        class="absolute rounded-full bg-white"
        :style="star.style"
      ></div>
    </div>

    <div>
      <!-- Section title -->
      <div
        v-motion
        class="text-center mb-16"
        :initial="conf.sectionTitle.initial"
        :visible="conf.sectionTitle.enter"
      >
        <h2 class="text-3xl md:text-4xl font-bold mb-4 text-white">
          Support Our <span class="text-highlight">Dark Sky Initiative</span>
        </h2>
        <p class="text-primary-200 text-lg max-w-3xl mx-auto">
          Your contribution will help us preserve India's night skies, protect wildlife, and promote
          sustainable lighting practices. Choose a pledge level below to make a difference.
        </p>
      </div>

      <!-- Pledge tiers -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        <IBGlass
          v-for="(tier, index) in pledgeTiers"
          :key="tier.id"
          v-motion
          hover-effect="glow"
          :glow-color="tier.highlight ? 'mixed' : 'blue'"
          :gradient="tier.highlight ? 'mixed' : 'blue'"
          :intensity="tier.highlight ? 'medium' : 'low'"
          interactive
          class="h-full relative"
          :class="{ 'z-10 transform md:scale-105': tier.highlight }"
          :initial="conf.card.initial"
          :enter="{
            ...conf.card.enter,
            transition: { ...conf.card.enter.transition, delay: index * 0.1 },
          }"
        >
          <div class="p-6 flex flex-col h-full">
            <!-- Tier header -->
            <div class="mb-6 text-center">
              <div class="flex justify-center mb-4">
                <div
                  class="w-16 h-16 rounded-full bg-primary-800/70 flex items-center justify-center border border-primary-600/30"
                >
                  <Icon
                    :name="tier.icon"
                    size="32px"
                    class="text-primary-400"
                  />
                </div>
              </div>
              <h3 class="text-2xl font-bold text-white mb-2">{{ tier.title }}</h3>
              <div class="text-xl font-semibold text-primary-500 mb-2">{{ tier.amount }}</div>
              <p class="text-primary-300">{{ tier.description }}</p>
            </div>

            <!-- Divider -->
            <div class="border-t border-primary-700/30 my-4"></div>

            <!-- Benefits list -->
            <ul class="space-y-3 mb-8 flex-grow">
              <li
                v-for="(benefit, benefitIndex) in tier.benefits"
                :key="benefitIndex"
                class="flex items-start"
              >
                <Icon
                  name="mdi:check-circle"
                  size="20px"
                  class="text-primary-500 mt-0.5 mr-2 flex-shrink-0"
                />
                <span class="text-primary-200 text-sm">{{ benefit }}</span>
              </li>
            </ul>

            <!-- Pledge button -->
            <div class="mt-auto">
              <PrimeButton
                :severity="tier.highlight ? 'primary' : 'secondary'"
                :class="tier.highlight ? 'w-full' : 'w-full'"
                @click="selectTier(tier)"
              >
                <div class="flex items-center justify-center gap-2 py-1">
                  <Icon
                    name="mdi:heart"
                    size="18px"
                  />
                  <span>Pledge Now</span>
                </div>
              </PrimeButton>
            </div>
          </div>
        </IBGlass>
      </div>
    </div>

    <!-- Pledge Form Dialog -->
    <IBFormDialog
      :visible="isFormVisible"
      :title="formTitle"
      :loading="isFormLoading"
      :success-message="formSuccessMessage"
      :error-message="formErrorMessage"
      :initial-values="formData"
      :resolver="formResolver"
      submit-button-text="Submit Pledge"
      @update:visible="isFormVisible = $event"
      @submit="handleSubmit"
    >
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label
              for="name"
              class="text-sm font-medium"
              >Full Name *</label
            >
            <PrimeInputText
              id="name"
              v-model="formData.name"
              placeholder="Your name"
              name="name"
              class="w-full"
            />
          </div>

          <div class="space-y-2">
            <label
              for="email"
              class="text-sm font-medium"
              >Email *</label
            >
            <PrimeInputText
              id="email"
              v-model="formData.email"
              placeholder="Your email address"
              name="email"
              class="w-full"
            />
          </div>

          <div class="space-y-2">
            <label
              for="phone"
              class="text-sm font-medium"
              >Phone Number *</label
            >
            <PrimeInputText
              id="phone"
              v-model="formData.phone"
              placeholder="Your contact number"
              name="phone"
              class="w-full"
            />
          </div>

          <div class="space-y-2">
            <label
              for="organization"
              class="text-sm font-medium"
              >Organization (Optional)</label
            >
            <PrimeInputText
              id="organization"
              v-model="formData.organization"
              placeholder="Company or organization name"
              name="organization"
              class="w-full"
            />
          </div>

          <div class="space-y-2 md:col-span-2">
            <label
              for="pledgeAmount"
              class="text-sm font-medium"
              >Pledge Amount *</label
            >
            <PrimeInputText
              id="pledgeAmount"
              v-model="formData.pledgeAmount"
              placeholder="Pledge amount"
              name="pledgeAmount"
              class="w-full"
              readonly
            />
          </div>

          <div class="space-y-2 md:col-span-2">
            <label
              for="message"
              class="text-sm font-medium"
              >Additional Message (Optional)</label
            >
            <PrimeTextarea
              id="message"
              v-model="formData.message"
              placeholder="Tell us any specific aspects of the initiative you're interested in supporting"
              name="message"
              rows="4"
              class="w-full"
            />
          </div>
        </div>

        <div class="mt-6 bg-primary-900/40 p-4 rounded-lg">
          <h4 class="font-semibold text-primary-300 mb-2 flex items-center">
            <Icon
              name="mdi:information-outline"
              class="mr-2"
            />
            What happens next?
          </h4>
          <p class="text-sm text-primary-200">
            After submitting this form, our team will contact you within 2 business days with
            payment information and details about how your contribution will be used. You'll receive
            regular updates on the progress of the initiatives you're supporting.
          </p>
        </div>
      </template>
    </IBFormDialog>
  </section>
</template>

<style scoped>
/* Additional styling if needed */
</style>
