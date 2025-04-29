<script setup lang="ts">
import { useForm } from '@primevue/forms/useform'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { ref, computed } from 'vue'
import { useOnboardingStore } from '@/stores/useOnboardingStore'

const emit = defineEmits(['complete'])
const onboardingStore = useOnboardingStore()
const analytics = useOnboardingAnalytics()

// Loading states
const isDetectingLocation = ref(false)
const isSearching = ref(false)

// Location data
const locationQuery = ref('')
const locationSuggestions = ref([])
const selectedLocation = ref(null)

// Define location schema - locations aren't required, but if submitted, validate structure
const locationSchema = z.object({
  location: z
    .object({
      placeName: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      countryCode: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .optional(),
})

// Create resolver
const resolver = zodResolver(locationSchema)

// Define initial values from store
const initialValues = {
  location: onboardingStore.stepData.location || null,
}

// Initialize form with useForm
const form = useForm({
  resolver,
  initialValues,
  validateOnValueUpdate: true,
})

// Define field on mount
onMounted(() => {
  form.defineField('location')
})

// Handle form submission
function handleSubmit(e) {
  if (e.valid) {
    emit('complete', e.values)
  }
}

// Auto-detect location using browser geolocation + reverse geocoding
async function detectLocation() {
  isDetectingLocation.value = true

  try {
    // Use browser geolocation API
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      })
    })

    const { latitude, longitude } = position.coords

    // Track analytics event
    analytics.trackLocationSearch('geolocation', 'Auto-detected')

    // Use reverse geocoding to get location name
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=12&addressdetails=1`,
      { headers: { 'Accept-Language': 'en-US,en' } },
    )

    if (!response.ok) {
      throw new Error('Failed to retrieve location data')
    }

    const locationData = await response.json()
    selectedLocation.value = locationData

    // Set the form value with formatted location data
    const formattedLocation = formatLocation(locationData)
    form.setFieldValue('location', formattedLocation)
  } catch (error) {
    console.error('Error detecting location:', error)
  } finally {
    isDetectingLocation.value = false
  }
}

// Format location data for storage
function formatLocation(location) {
  const address = location.address || {}
  return {
    placeName: location.display_name,
    city: address.city || address.town || address.village || address.hamlet,
    state: address.state,
    country: address.country,
    countryCode: address.country_code,
    latitude: parseFloat(location.lat),
    longitude: parseFloat(location.lon),
  }
}

// Search for locations using user input
async function searchLocations(event) {
  const query = event.query

  if (!query || query.length < 3) {
    locationSuggestions.value = []
    return
  }

  isSearching.value = true

  try {
    // Track search analytics
    analytics.trackLocationSearch('search', 'Text search', query)

    // Use OpenStreetMap Nominatim API for geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
      { headers: { 'Accept-Language': 'en-US,en' } },
    )

    if (!response.ok) {
      throw new Error('Failed to search locations')
    }

    const data = await response.json()

    // Format suggestions for display
    locationSuggestions.value = data.map((item) => ({
      data: item,
      label: item.display_name,
    }))
  } catch (error) {
    console.error('Error searching locations:', error)
    locationSuggestions.value = []
  } finally {
    isSearching.value = false
  }
}

// Handle selected from autocomplete
function onLocationSelected(event) {
  const locationData = event.value.data
  selectedLocation.value = locationData
  form.setFieldValue('location', formatLocation(locationData))
}

// Get active location for display
const currentLocationDisplay = computed(() => {
  if (selectedLocation.value) {
    return selectedLocation.value.display_name
  }

  const locationState = form.getFieldState('location')?.value
  if (locationState?.placeName) {
    return locationState.placeName
  }

  return null
})
</script>

<template>
  <div class="location-step">
    <h2 class="text-2xl font-bold mb-2">Where are you located?</h2>
    <p class="text-gray-400 mb-6">This helps us show relevant events and content near you.</p>

    <PrimeForm
      :form-control="form"
      @submit="handleSubmit"
    >
      <!-- Auto-detect location button -->
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

      <!-- Hidden form field for location data -->
      <PrimeFormField
        v-slot="field"
        name="location"
      >
        <input
          type="hidden"
          v-bind="field.props"
        />
      </PrimeFormField>

      <!-- Location search autocomplete -->
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
          field="label"
          class="w-full"
          :loading="isSearching"
          placeholder="Start typing your city, region or country"
          :dropdown="true"
          @complete="searchLocations"
          @item-select="onLocationSelected"
        />
        <div class="text-xs text-gray-400 mt-1">Enter at least 3 characters to search</div>
      </div>

      <!-- Selected location display -->
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

      <!-- Skip note -->
      <p class="text-sm text-gray-400 mb-4">
        This step is optional. You can continue without providing your location.
      </p>

      <!-- Navigation buttons -->
      <div class="flex justify-end mt-6">
        <PrimeButton
          type="submit"
          label="Continue"
          icon="mdi:arrow-right"
          icon-pos="right"
        />
      </div>
    </PrimeForm>
  </div>
</template>
