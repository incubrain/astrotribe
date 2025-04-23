<script setup lang="ts">
// Page metadata
definePageMeta({
  name: 'AdvertisingPage',
  layout: 'default',
})

const formData = ref({
  name: '',
  email: '',
  inquiryType: '',
  message: '',
})

const isModalOpen = ref(false)
const showSuccessMessage = ref(false)
const isSubmitting = ref(false)

const openModal = () => (isModalOpen.value = true)

const modalConfig = ref({ header: '', textareaTitle: '', textareaPlaceholder: '' })

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

useHead({
  title: 'Advertise With AstronEra | Connect With Astronomy Enthusiasts',
  meta: [
    {
      name: 'description',
      content:
        'Promote your space-tech company, institutions, event, or research to our engaged community of astronomy enthusiasts across India and beyond.',
    },
  ],
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <AdvertHero :open-modal="openModal" />

    <!-- Why Partner With AstronEra -->
    <AdvertPartnerBenefits />

    <!-- Customer Profiles Section -->
    <AdvertCustomerProfiles />

    <!-- Advertising Packages -->
    <AdvertPackages :open-modal="openModal" />

    <!-- FAQ Section -->
    <AdvertFAQ />
    <PrimeDialog
      v-model:visible="isModalOpen"
      modal
      :closable="true"
      :dismissable-mask="true"
      header="Advertise with Us"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    >
      <div class="p-4">
        <PrimeForm
          class="space-y-4"
          @submit.prevent="submitForm"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label
                for="name"
                class="block text-sm font-medium"
                >Your Name</label
              >
              <PrimeInputText
                id="name"
                v-model="formData.name"
                class="w-full"
              />
            </div>
            <div class="space-y-2">
              <label
                for="email"
                class="block text-sm font-medium"
                >Email Address</label
              >
              <PrimeInputText
                id="email"
                v-model="formData.email"
                class="w-full"
              />
            </div>
          </div>
          <div class="space-y-2">
            <label
              for="message"
              class="block text-sm font-medium"
              >Tell us what your requirements</label
            >
            <PrimeTextarea
              id="message"
              v-model="formData.message"
              rows="5"
              placeholder="Please write in brief what you require"
              class="w-full"
            />
          </div>
          <div class="flex justify-end pt-4">
            <PrimeButton
              type="submit"
              :loading="isSubmitting"
              class="bg-primary-600"
              >Send</PrimeButton
            >
          </div>

          <div
            v-if="showSuccessMessage"
            class="mt-4 p-3 bg-green-800/50 text-green-200 rounded text-center"
          >
            Application submitted successfully! We'll get back to you soon.
          </div>
        </PrimeForm>
      </div>
    </PrimeDialog>
  </div>
</template>
