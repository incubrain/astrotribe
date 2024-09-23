<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string
  label?: string
  id?: string
  suggestions?: string[]
  invalid?: boolean
  feedback?: boolean
  toggleMask?: boolean
  placeholder?: string
  disabled?: boolean
  required?: boolean
  inputClass?: string
  weakLabel?: string
  mediumLabel?: string
  strongLabel?: string
  promptLabel?: string
  mediumRegex?: string
  strongRegex?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  id: 'password',
  suggestions: () => [
    'At least one lowercase',
    'At least one uppercase',
    'At least one numeric',
    'Minimum 8 characters',
  ],
  invalid: false,
  feedback: true,
  toggleMask: true,
  placeholder: undefined,
  disabled: false,
  required: false,
  inputClass: 'w-full',
  weakLabel: 'Weak',
  mediumLabel: 'Medium',
  strongLabel: 'Strong',
  promptLabel: 'Please enter a password',
  mediumRegex:
    '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})',
  strongRegex: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const onPasswordChange = (value: string) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <label
    v-if="label"
    :for="id"
  >{{ label }}</label>
  <PrimePassword
    :id="id"
    class="w-full"
    :input-class="inputClass"
    :model-value="modelValue"
    :invalid="invalid"
    :feedback="feedback"
    :toggle-mask="toggleMask"
    :disabled="disabled"
    :required="required"
    :weak-label="weakLabel"
    :medium-label="mediumLabel"
    :strong-label="strongLabel"
    :placeholder="placeholder"
    :prompt-label="props.promptLabel"
    :medium-regex="props.mediumRegex"
    :strong-regex="props.strongRegex"
    @update:model-value="onPasswordChange"
  >
    <template #footer>
      <PrimeDivider />
      <p class="mt-2">
        Suggestions
      </p>
      <ul
        class="ml-2 mt-0 pl-2"
        style="line-height: 1.5"
      >
        <li
          v-for="suggestion in props.suggestions"
          :key="suggestion"
        >
          {{ suggestion }}
        </li>
      </ul>
    </template>
  </PrimePassword>
</template>

<style scoped></style>
