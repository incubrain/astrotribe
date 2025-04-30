<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, onMounted, watch } from 'vue'

const form = useOnboardingForm()

const props = defineProps({
  // Field name for form binding
  name: {
    type: String,
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

function toggleSelection(value: string) {
  const currentState = form.getFieldState(props.name)?.value
  if (props.multiple) {
    const list = Array.isArray(currentState) ? [...currentState] : []
    const idx = list.indexOf(value)
    if (idx === -1) list.push(value)
    else list.splice(idx, 1)
    console.log(`[${props.name}] Toggled multiple selection:`, list)
    form.setFieldValue(props.name, list)
  } else {
    console.log(`[${props.name}] Toggled selection:`, value)
    form.setFieldValue(props.name, value)
  }
}

function isSelected(value: string) {
  const current = form.getFieldState(props.name)?.value
  return props.multiple ? Array.isArray(current) && current.includes(value) : current === value
}
</script>

<template>
  <div>
    <PrimeFormField
      v-slot="field"
      :name="name"
    >
      <input
        type="hidden"
        v-bind="field.props"
      />
      <PrimeMessage
        v-if="field.invalid && field.touched"
        severity="error"
        class="mb-4"
      >
        {{ field.error?.message }}
      </PrimeMessage>
    </PrimeFormField>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
      <PrimeCard
        v-for="option in options"
        :key="option.value"
        :class="[cardClass, isSelected(option.value) ? selectedClass : unselectedClass]"
        @click="toggleSelection(option.value)"
      >
        <template #content>
          <div class="flex items-center gap-4">
            <div
              v-if="option.icon"
              class="rounded-full p-3 bg-gray-800 flex"
            >
              <Icon
                :name="option.icon"
                size="24px"
              />
            </div>
            <div>
              <h3 class="text-lg font-medium">{{ option.label }}</h3>
              <p
                v-if="option.description"
                class="text-sm text-gray-400"
                >{{ option.description }}</p
              >
            </div>
          </div>
        </template>
      </PrimeCard>
    </div>
  </div>
</template>
