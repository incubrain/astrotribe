<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRuntimeConfig } from '#app'

const config = useRuntimeConfig()
const { $devHelper } = useNuxtApp()

const showControls = ref(false)
const features = reactive({ ...config.public.devHelper.features })

const updateFeature = (feature: string) => {
  $devHelper.toggleFeature(feature, features[feature])
}

const formatFeatureName = (feature: string) => {
  return feature
    .split(/(?=[A-Z])/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const closeControls = () => {
  showControls.value = false
}
</script>

<template>
  <div class="foreground rounded-lg shadow-lg">
    <div class="border-color border-b px-4 py-3">
      <h3 class="text-lg font-medium">Error Logging Controls</h3>
    </div>
    <div class="px-4 py-3">
      <div class="space-y-3">
        <div
          v-for="(enabled, feature) in features"
          :key="feature"
          class="flex items-center"
        >
          <PrimeCheckbox
            :id="feature"
            v-model="features[feature]"
            :binary="true"
            @change="updateFeature(feature)"
            class="mr-3"
          />
          <label
            :for="feature"
            class="cursor-pointer text-sm"
            >{{ formatFeatureName(feature) }}</label
          >
        </div>
      </div>
    </div>
  </div>
</template>
