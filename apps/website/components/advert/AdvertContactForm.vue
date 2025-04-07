<script setup lang="ts">
import { ref } from 'vue'

// Form state
const formData = ref({
  name: '',
  company: '',
  email: '',
  phone: '',
  website: '',
  preferredDate: null,
  message: '',
  customerType: null,
})

const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref(false)
const errorMessage = ref('')
const isDialogVisible = ref(false)

// Customer types
const customerTypes = [
  { name: 'Space-Tech Company', value: 'space-tech' },
  { name: 'Stargazing Club', value: 'stargazing' },
  { name: 'Event Organizer', value: 'events' },
  { name: 'Researcher', value: 'researcher' },
  { name: 'Other', value: 'other' },
]

// Form submission
const submitForm = async () => {
  isSubmitting.value = true
  submitSuccess.value = false
  submitError.value = false
  errorMessage.value = ''

  try {
    // Simulating API call for demo purposes
    await new Promise((resolve) => setTimeout(resolve, 1500))

    submitSuccess.value = true

    // Reset form
    formData.value = {
      name: '',
      company: '',
      email: '',
      phone: '',
      website: '',
      preferredDate: null,
      message: '',
      customerType: null,
    }

    // Close dialog after 3 seconds on success
    setTimeout(() => {
      isDialogVisible.value = false
    }, 3000)
  } catch (error: any) {
    console.error('Form submission error:', error)
    submitError.value = true
    errorMessage.value = 'Network error. Please try again later.'
  } finally {
    isSubmitting.value = false
  }
}

// Open the dialog
const openDialog = () => {
  isDialogVisible.value = true
}
</script>

<template>
  <div
    id="contact-form"
    class="my-8"
  >
    <div class="text-center">
      <PrimeButton
        class="bg-primary-600 hover:bg-primary-700 px-6 py-3"
        @click="openDialog"
      >
        Advertise With Us
        <Icon
          name="i-lucide-rocket"
          class="ml-2"
        />
      </PrimeButton>
    </div>

    <PrimeDialog
      v-model:visible="isDialogVisible"
      modal
      header="Advertise With AstronEra"
      :style="{ width: '50rem', maxWidth: '95vw' }"
    >
      <IBGlass
        hover-effect="glow"
        glow-color="purple"
        gradient="mixed"
        intensity="low"
        class="p-6"
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
                >Organization Name *</label
              >
              <PrimeInputText
                id="company"
                v-model="formData.company"
                required
                class="w-full"
                placeholder="Your organization"
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
                placeholder="yourorganization.com"
              />
            </div>

            <div>
              <label
                for="customerType"
                class="block mb-2"
                >Organization Type *</label
              >
              <PrimeDropdown
                id="customerType"
                v-model="formData.customerType"
                :options="customerTypes"
                option-label="name"
                option-value="value"
                placeholder="Select organization type"
                class="w-full"
                required
              />
            </div>

            <div>
              <label
                for="preferredDate"
                class="block mb-2"
                >Preferred Meeting Date</label
              >
              <PrimeCalendar
                id="preferredDate"
                v-model="formData.preferredDate"
                class="w-full"
                placeholder="Select date"
                show-icon
              />
            </div>

            <div class="md:col-span-2">
              <label
                for="message"
                class="block mb-2"
                >Your Message *</label
              >
              <PrimeTextarea
                id="message"
                v-model="formData.message"
                rows="4"
                class="w-full"
                placeholder="Tell us about your organization and advertising goals"
                required
              />
            </div>
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
            {{
              errorMessage ||
              'There was an error submitting your request. Please try again or contact us directly at info@astronera.org.'
            }}
          </div>

          <!-- Submit Button -->
          <div class="text-center">
            <PrimeButton
              type="submit"
              icon="i-lucide-send"
              icon-pos="right"
              class="bg-primary-600 hover:bg-primary-700 px-6 py-3 text-lg"
              :loading="isSubmitting"
            >
              Submit Your Information
            </PrimeButton>
          </div>
        </form>
      </IBGlass>
    </PrimeDialog>
  </div>
</template>
