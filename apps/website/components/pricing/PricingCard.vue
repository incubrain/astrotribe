<script setup lang="ts">
import { usePersona } from '~/composables/usePersona'

const { activePersona, personaStyles } = usePersona()

const props = defineProps<{
  title: string
  description: string
  price: string | number
  currency: string
  period: string
  features: Array<string>
  disabledFeatures?: Array<string>
  specialFeature?: string
  popular?: boolean
  comingSoon?: boolean
  buttonText: string
  buttonAction?: () => void
  buttonDisabled?: boolean
  annualSavings?: number
  originalMonthlyPrice?: number
}>()

// Emit events
const emit = defineEmits<{
  action: []
}>()

// Handle button click
const handleButtonClick = () => {
  if (props.buttonAction) {
    props.buttonAction()
  }
  emit('action')
}

// Determine if a feature is the special persona feature
const isSpecialFeature = (feature: string) => {
  return props.specialFeature && feature === props.specialFeature
}

// Check if a feature is in the disabled list
const isDisabledFeature = (feature: string) => {
  return props.disabledFeatures && props.disabledFeatures.includes(feature)
}
</script>

<template>
  <div class="relative group h-full">
    <!-- Popular tag -->
    <div
      v-if="popular"
      class="absolute -top-3 inset-x-0 flex justify-center z-20"
    >
      <span
        class="text-white text-xs font-semibold px-4 py-1 rounded-full shadow-lg transition-colors duration-500"
        :class="`bg-gradient-to-r from-${activePersona.color}-600 to-${activePersona.color === 'blue' ? 'primary' : activePersona.color}-600`"
      >
        Most Popular
      </span>
    </div>

    <!-- Coming soon badge -->
    <div
      v-if="comingSoon"
      class="absolute -top-3 right-4 z-10"
    >
      <span
        class="text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md transition-colors duration-500"
        :class="`bg-${activePersona.color}-600/90`"
      >
        Coming Soon
      </span>
    </div>

    <div
      class="h-full bg-slate-900/60 backdrop-blur-sm rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-slate-800/30 flex flex-col"
      :class="[
        popular
          ? `border border-${activePersona.color}-700/50 shadow-lg shadow-${activePersona.color}-900/10 hover:shadow-${activePersona.color}-900/20 hover:-translate-y-1`
          : 'border border-slate-800/50 hover:-translate-y-1',
        comingSoon ? 'opacity-80' : '',
      ]"
    >
      <div class="p-6 flex-1 flex flex-col">
        <h3 class="text-2xl font-bold text-white mb-2">{{ title }}</h3>
        <p class="text-gray-400 text-sm mb-6">{{ description }}</p>

        <div class="flex items-end mb-8 gap-3">
          <div>
            <div class="flex items-end gap-1">
              <span class="text-4xl font-bold text-white">{{ currency }}{{ price }}</span>
              <span class="text-gray-400 text-sm">{{ period }}</span>
            </div>

            <div
              v-if="annualSavings && originalMonthlyPrice"
              class="text-sm text-gray-400 flex items-center gap-2 pt-2"
            >
              <span class="line-through">{{ currency }}{{ originalMonthlyPrice }}</span>
              <span
                class="text-emerald-400 text-xs bg-emerald-900/30 border font-medium border-emerald-800/40 px-2 py-0.5 rounded-full"
              >
                Save {{ currency }}{{ annualSavings }}
              </span>
            </div>
          </div>
        </div>

        <div class="space-y-4 mb-8 flex-1">
          <div
            v-for="(feature, index) in features"
            :key="`feature-${index}`"
            class="flex items-start"
          >
            <Icon
              name="mdi:check-circle"
              class="flex-shrink-0 mt-0.5 mr-3 transition-colors duration-500"
              :class="[
                isSpecialFeature(feature)
                  ? `text-${activePersona.color}-500`
                  : popular || comingSoon
                    ? `text-${activePersona.color}-500`
                    : 'text-blue-500',
              ]"
              size="20"
            />
            <span
              class="text-gray-300"
              :class="{ 'font-medium': isSpecialFeature(feature) }"
              >{{ feature }}</span
            >
          </div>

          <div
            v-for="(feature, index) in disabledFeatures"
            :key="`disabled-feature-${index}`"
            class="flex items-start"
          >
            <Icon
              name="mdi:close-circle"
              class="flex-shrink-0 mt-0.5 mr-3 text-gray-600"
              size="20"
            />
            <span class="text-gray-500">{{ feature }}</span>
          </div>
        </div>

        <!-- CTA Button -->
        <AuthWrapper
          mode="register"
          :query-params="{ plan: title.toLowerCase() }"
        >
          <template #default="{ authAction }">
            <PrimeButton
              class="w-full border-none transition-colors duration-500"
              :class="[
                popular
                  ? personaStyles.primaryButton
                  : comingSoon
                    ? `bg-${activePersona.color}-600/80 hover:bg-${activePersona.color}-600/90`
                    : 'bg-slate-700 hover:bg-slate-600',
              ]"
              :disabled="buttonDisabled || comingSoon"
              @click="
                () => {
                  handleButtonClick()
                  authAction()
                }
              "
            >
              {{ buttonText }}
            </PrimeButton>
          </template>
        </AuthWrapper>
      </div>
    </div>
  </div>
</template>
