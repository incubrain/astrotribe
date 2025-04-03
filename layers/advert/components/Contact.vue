<script setup lang="ts">
const form = reactive({
  // Company Information
  companyName: '',
  website: '',

  // Contact Information
  contactName: '',
  email: '',
  position: '',

  // Advertising Details
  interestedPackage: '',
  budget: null as number | null,
  startDate: '',

  // Campaign Information
  objectives: [] as string[],
  targetAudience: '',
  message: '',
})

const { adPackages } = storeToRefs(useAdsStore())

const objectives = [
  'Brand Awareness',
  'Lead Generation',
  'Product Launch',
  'Recruitment',
  'Event Promotion',
  'Research/Study Promotion',
]

const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

const handleSubmit = async () => {
  loading.value = true
  error.value = null

  try {
    await $fetch('/api/advertising/inquiries', {
      method: 'POST',
      body: form,
    })
    success.value = true
    // Reset form after successful submission
  } catch (err) {
    error.value = 'Failed to submit inquiry. Please try again or contact us directly.'
    console.error('Form submission error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="wrapper mx-auto py-16">
    <h2 class="text-2xl md:text-3xl font-bold mb-4 text-center">Get Started</h2>
    <p class="text-gray-400 text-center mb-12">Tell us about your advertising goals</p>

    <div class="bg-[#0A1021] rounded-lg border border-blue-900/30 p-6">
      <form
        class="space-y-6"
        @submit.prevent="handleSubmit"
      >
        <!-- Success Message -->
        <div
          v-if="success"
          class="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg"
        >
          Thank you for your interest! We'll get back to you within 24 hours.
        </div>

        <!-- Error Message -->
        <div
          v-if="error"
          class="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg"
        >
          {{ error }}
        </div>

        <!-- Company Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm text-gray-400 mb-2">Company Name *</label>
            <PrimeInputText
              v-model="form.companyName"
              class="w-full bg-[#030711]"
              required
            />
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">Company Website</label>
            <PrimeInputText
              v-model="form.website"
              class="w-full bg-[#030711]"
              type="url"
            />
          </div>
        </div>

        <!-- Contact Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm text-gray-400 mb-2">Contact Name *</label>
            <PrimeInputText
              v-model="form.contactName"
              class="w-full bg-[#030711]"
              required
            />
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">Position/Role *</label>
            <PrimeInputText
              v-model="form.position"
              class="w-full bg-[#030711]"
              required
            />
          </div>
        </div>

        <div>
          <label class="block text-sm text-gray-400 mb-2">Email *</label>
          <PrimeInputText
            v-model="form.email"
            type="email"
            class="w-full bg-[#030711]"
            required
          />
        </div>

        <!-- Advertising Details -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm text-gray-400 mb-2">Package Interest *</label>
            <PrimeSelect
              v-model="form.interestedPackage"
              :options="adPackages"
              option-label="name"
              option-value="id"
              placeholder="Select a package"
              class="w-full bg-[#030711]"
              required
            />
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">Desired Start Date</label>
            <PrimeDatePicker
              v-model="form.startDate"
              class="w-full bg-[#030711]"
              :min-date="new Date()"
            />
          </div>
        </div>

        <!-- Campaign Information -->
        <div class="flex flex-col gap-2">
          <label class="text-sm text-gray-400">Campaign Objectives</label>
          <PrimeSelectButton
            v-model="form.objectives"
            :options="objectives"
            multiple
            class="w-full grid grid-cols-3 gap-2"
          />
        </div>

        <div>
          <label class="block text-sm text-gray-400 mb-2">Target Audience Description</label>
          <PrimeTextarea
            v-model="form.targetAudience"
            class="w-full bg-[#030711]"
            rows="2"
            placeholder="Describe your ideal audience..."
          />
        </div>

        <div>
          <label class="block text-sm text-gray-400 mb-2">Additional Information</label>
          <PrimeTextarea
            v-model="form.message"
            rows="4"
            class="w-full bg-[#030711]"
            placeholder="Tell us more about your advertising goals..."
          />
        </div>

        <div class="text-center">
          <PrimeButton
            type="submit"
            :loading="loading"
            class="px-8"
          >
            <template #default>
              <span class="flex items-center gap-2">
                <Icon name="mdi:rocket-launch-outline" />
                Submit Inquiry
              </span>
            </template>
          </PrimeButton>
        </div>
      </form>
    </div>
  </section>
</template>
