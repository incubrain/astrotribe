<script setup lang="ts">
import type { FormInstance } from '@primevue/forms'
import { ref, computed } from 'vue'

const form = useOnboardingForm()

const isDetectingLocation = ref(false)
const isSearching = ref(false)
const locationQuery = ref('')
const locationSuggestions = ref([])
const selectedLocation = ref(null)

const analytics = useOnboardingAnalytics()

function formatLocation(loc: any) {
  console.log('formatLocation called:', loc)
  const address = loc.address || {}
  return {
    full_address: loc.display_name,
    address_line1: address.road || '',
    address_line2: address.neighbourhood || '',
    city: address.city || address.town || address.village || address.hamlet,
    state: address.state,
    postal_code: address.postcode,
    country: address.country,
    country_code: address.country_code,
    latitude: parseFloat(loc.lat),
    longitude: parseFloat(loc.lon),
    address_type: 'user',
    is_primary: true,
  }
}

function storeLocation(formattedLocation: any) {
  selectedLocation.value = formattedLocation
  console.log('Stored selectedLocation', selectedLocation.value)
  form.setFieldValue('location', formattedLocation)
  console.log('Stored selectedLocation2', form.getFieldState('location')?.value)
}

async function detectLocation() {
  isDetectingLocation.value = true

  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
      }),
    )

    const { latitude, longitude } = position.coords

    analytics.trackLocationSearch('geolocation', 'Auto-detected')

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=12&addressdetails=1`,
      { headers: { 'Accept-Language': 'en-US,en' } },
    )

    if (!response.ok) throw new Error('Reverse geocoding failed')

    console.log('Reverse geocoding response:', response)
    const locationData = await response.json()
    console.log('Reverse geocoding response decoded:', locationData)
    const formatted = formatLocation(locationData)
    storeLocation(formatted)
  } catch (error) {
    console.error('Geolocation error:', error)
  } finally {
    isDetectingLocation.value = false
  }
}

async function searchLocations(event: { query: string }) {
  const query = event.query

  if (!query || query.length < 3) {
    locationSuggestions.value = []
    return
  }

  isSearching.value = true

  try {
    analytics.trackLocationSearch('search', 'Text search', query)

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query,
      )}&limit=5&addressdetails=1`,
      { headers: { 'Accept-Language': 'en-US,en' } },
    )

    const data = await response.json()
    locationSuggestions.value = data.map((item: any) => ({
      data: item,
      label: item.display_name,
    }))
  } catch (error) {
    console.error('Search error:', error)
    locationSuggestions.value = []
  } finally {
    isSearching.value = false
  }
}

function onLocationSelected(event: { value: { data: any } }) {
  const raw = event.value.data
  const formatted = formatLocation(raw)
  storeLocation(formatted)
}

const currentLocationDisplay = computed(() => {
  if (selectedLocation.value?.full_address) {
    return selectedLocation.value.full_address
  }

  const saved = form.getFieldState('location')?.value
  return saved?.full_address || null
})
</script>

<template>
  <div class="location-step">
    <h2 class="text-2xl font-bold mb-2">Where are you located?</h2>
    <p class="text-gray-400 mb-6">This helps us show relevant events and content near you.</p>

    <!-- Auto-detect -->
    <div class="mb-6">
      <PrimeButton
        type="button"
        icon="mdi:map-marker"
        :label="isDetectingLocation ? 'Detecting...' : 'Auto-detect my location'"
        :loading="isDetectingLocation"
        :disabled="isDetectingLocation"
        outlined
        @click="detectLocation"
      />
      <p class="text-sm text-gray-400 mt-2"> Or search for your location below. </p>
    </div>

    <!-- Autocomplete -->
    <div class="mb-6">
      <label
        for="location-search"
        class="block text-sm font-medium mb-2"
        >Search for your location</label
      >
      <PrimeAutoComplete
        id="location-search"
        v-model="locationQuery"
        :suggestions="locationSuggestions"
        option-label="label"
        class="w-full"
        :loading="isSearching"
        placeholder="Start typing your city, region or country"
        :dropdown="true"
        @complete="searchLocations"
        @item-select="onLocationSelected"
      >
        <template #option="slotProps">
          <div class="p-2 text-sm text-white">
            {{ slotProps.option.label }}
          </div>
        </template>
      </PrimeAutoComplete>
      <div class="text-xs text-gray-400 mt-1">Enter at least 3 characters to search</div>
    </div>

    <!-- Display selected -->
    <PrimeFormField
      v-slot="field"
      name="location"
    >
      <input
        type="hidden"
        v-bind="field.props"
      />
      <div
        v-if="currentLocationDisplay"
        class="p-4 bg-gray-800/50 rounded-lg mb-6"
      >
        <h3 class="text-sm font-medium mb-2">Selected Location</h3>
        <div class="flex items-center gap-2">
          <Icon
            name="mdi:map-marker"
            class="text-primary-500"
            size="20px"
          />
          <span>{{ currentLocationDisplay }}</span>
        </div>
      </div>
    </PrimeFormField>

    <p class="text-sm text-gray-400 mt-4">
      This step is optional. You can continue without providing your location.
    </p>
  </div>
</template>
