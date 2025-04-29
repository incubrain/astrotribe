<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, onMounted, watch } from 'vue'

const props = defineProps({
  // Field name for form binding
  name: {
    type: String,
    required: true,
  },

  // Form control instance from useForm()
  form: {
    type: Object,
    required: true,
  },

  // Options for the selectable cards
  options: {
    type: Array as PropType<
      Array<{
        value: string
        label: string
        icon?: string
        description?: string
        [key: string]: any
      }>
    >,
    required: true,
  },

  // Whether to allow multiple selections
  multiple: {
    type: Boolean,
    default: false,
  },

  // Additional classes for selected cards
  selectedClass: {
    type: String,
    default: 'border-primary-500 bg-primary-500/20',
  },

  // Additional classes for unselected cards
  unselectedClass: {
    type: String,
    default: 'border-gray-700 hover:border-gray-500 bg-gray-800/10',
  },

  // Base classes applied to all cards
  cardClass: {
    type: String,
    default: 'cursor-pointer transition-all hover:shadow-md',
  },

  // Optional analytics tracking callback
  trackSelection: {
    type: Function as PropType<(value: string, label: string, isSelected: boolean) => void>,
    default: null,
  },
})

// Define the field on mount and handle cleanup on unmount
onMounted(() => {
  if (!props.form.getFieldState(props.name)) {
    props.form.defineField(props.name)
  }
})

// Handle tracking selections if a tracking function is provided
function trackToggle(value, label, isSelected) {
  if (props.trackSelection) {
    props.trackSelection(value, label, isSelected)
  }
}

// For multiple selections (array value)
function toggleMultiple(value, label) {
  const currentValues = [...(props.form.getFieldState(props.name)?.value || [])]
  const index = currentValues.indexOf(value)

  if (index === -1) {
    // Add to selection
    currentValues.push(value)
    trackToggle(value, label, true)
  } else {
    // Remove from selection
    currentValues.splice(index, 1)
    trackToggle(value, label, false)
  }

  props.form.setFieldValue(props.name, currentValues)
}

// For single selection (string value)
function setSingle(value, label) {
  const currentValue = props.form.getFieldState(props.name)?.value

  // If already selected, track as deselected then selected again (for analytics)
  if (currentValue === value) {
    trackToggle(currentValue, label, false)
  }

  // Set the new value
  props.form.setFieldValue(props.name, value)
  trackToggle(value, label, true)
}

// Check if an option is selected
function isSelected(value) {
  const fieldValue = props.form.getFieldState(props.name)?.value

  if (props.multiple) {
    return Array.isArray(fieldValue) && fieldValue.includes(value)
  } else {
    return fieldValue === value
  }
}

// Get the field state
const fieldState = computed(() => {
  return props.form.getFieldState(props.name)
})
</script>

<template>
  <div>
    <!-- Hidden input to ensure proper form validation -->
    <PrimeFormField
      v-slot="field"
      :name="name"
    >
      <input
        type="hidden"
        v-bind="field.props"
      />

      <!-- Validation message -->
      <slot
        name="error"
        :field="field"
      >
        <PrimeMessage
          v-if="field.invalid && field.touched"
          severity="error"
          class="mb-4"
        >
          {{ field.error?.message }}
        </PrimeMessage>
      </slot>
    </PrimeFormField>

    <!-- Selectable cards grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
      <PrimeCard
        v-for="option in options"
        :key="option.value"
        :class="[cardClass, isSelected(option.value) ? selectedClass : unselectedClass]"
        @click="
          multiple
            ? toggleMultiple(option.value, option.label)
            : setSingle(option.value, option.label)
        "
      >
        <template #content>
          <slot
            name="card-content"
            :option="option"
            :selected="isSelected(option.value)"
          >
            <div class="flex items-center gap-3 p-2">
              <div
                v-if="option.icon"
                class="rounded-full p-3 bg-gray-800"
              >
                <Icon
                  :name="option.icon"
                  size="24px"
                />
              </div>
              <div
                v-else-if="multiple"
                class="w-6 h-6 flex items-center justify-center"
              >
                <Icon
                  :name="isSelected(option.value) ? 'mdi:check-circle' : 'mdi:circle-outline'"
                  size="24px"
                  :class="isSelected(option.value) ? 'text-primary-500' : 'text-gray-400'"
                />
              </div>
              <div>
                <h3 class="text-lg font-medium">{{ option.label }}</h3>
                <p
                  v-if="option.description"
                  class="text-sm text-gray-400"
                >
                  {{ option.description }}
                </p>
              </div>
            </div>
          </slot>
        </template>
      </PrimeCard>
    </div>

    <!-- Counter for multiple selections -->
    <div
      v-if="multiple"
      class="text-sm text-gray-400 mb-4"
    >
      {{ (fieldState?.value || []).length }} items selected
    </div>

    <!-- Extra slot for custom content -->
    <slot :field-state="fieldState"></slot>
  </div>
</template>
