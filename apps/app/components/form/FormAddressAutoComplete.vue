<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { config, autofill, MapboxAddressAutofill } from '@mapbox/search-js-web'
import { useOnboardingForm } from '@/composables/onboard/useOnboardingForm'

const form = useOnboardingForm()
const addressInput = ref<HTMLInputElement | null>(null)

function mapToStructuredLocation(feature: any) {
  const props = feature?.properties || {}
  const coords = feature?.geometry?.coordinates || [null, null]

  return {
    street1: props.address_line1 || '',
    street2: props.address_line2 || '',
    city_name: props.address_level2 || '',
    state: props.address_level1 || '',
    country_name: props.country || '',
    country_code: props.country_code || '',
    postcode: props.postcode || '',
    latitude: coords[1],
    longitude: coords[0],
    place_name: props.full_address || '',
  }
}

onMounted(() => {
  config.accessToken =
    'pk.eyJ1IjoiZHJldy1tYWNnaWJib24iLCJhIjoiY21hM2ZscWN1MXpsMzJsc2czdDlmbjF2MiJ9.BOTSWAPMf9nDGUN0sYmpNw'

  const autofillInstance = autofill({
    options: {
      country: 'in',
      language: 'en',
      limit: 5,
      proximity: 'ip',
      streets: true,
    },
    popoverOptions: {
      offset: 16,
      placement: 'bottom-start',
    },
    confirmOnBrowserAutofill: true,
    browserAutofillEnabled: true,
  })

  autofillInstance.addEventListener('suggest', (event) => {
    console.log('[Mapbox] suggest →', event.detail.suggestions)
  })

  autofillInstance.addEventListener('suggesterror', (event) => {
    console.error('[Mapbox] suggesterror →', event.detail)
  })

  autofillInstance.addEventListener('retrieve', (event) => {
    console.log('[Mapbox] retrieve →', event.detail)
    const feature = event.detail.features?.[0]
    if (!feature) return

    const location = mapToStructuredLocation(feature)
    console.log('Mapped location:', location)

    // Just store internally; don't submit yet
    form.setFieldValue('location', location)
  })
})
</script>

<template>
  <div class="location-step">
    <h2 class="text-2xl font-bold mb-2">Where are you located?</h2>
    <p class="text-gray-400 mb-6">Start typing your address and select from the suggestions.</p>

    <div>
      <label class="block text-sm font-medium mb-1">Address</label>
      <input
        ref="addressInput"
        class="input"
        autocomplete="address-line1"
        name="address-line1"
        placeholder="Start typing your address..."
      />
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">Address Line 2</label>
      <input
        class="input input-bordered w-full"
        autocomplete="address-line2"
        name="address-line2"
      />
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium mb-1">City</label>
        <input
          class="input input-bordered w-full"
          autocomplete="address-level2"
          name="address-level2"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">State</label>
        <input
          class="input input-bordered w-full"
          autocomplete="address-level1"
          name="address-level1"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Postcode</label>
        <input
          class="input input-bordered w-full"
          autocomplete="postal-code"
          name="postal-code"
          required
        />
      </div>
    </div>

    <PrimeFormField
      v-slot="field"
      name="location"
    >
      <input
        type="hidden"
        v-bind="field.props"
      />
    </PrimeFormField>
  </div>
</template>
