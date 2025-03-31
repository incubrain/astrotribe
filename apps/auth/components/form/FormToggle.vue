<script setup lang="ts">
const props = defineProps({
  activeMethod: {
    type: String,
    required: true,
    validator: (value: string) => ['magic-link', 'password'].includes(value),
  },
})

const emit = defineEmits(['update:activeMethod'])

function switchMethod(method: 'magic-link' | 'password') {
  emit('update:activeMethod', method)
}
</script>

<template>
  <div class="flex justify-center items-center gap-2 my-4">
    <PrimeButton
      type="button"
      :outlined="activeMethod !== 'magic-link'"
      :text="activeMethod !== 'magic-link'"
      size="small"
      @click="switchMethod('magic-link')"
    >
      Magic Link
    </PrimeButton>

    <span class="text-sm text-gray-400">or</span>

    <PrimeButton
      type="button"
      :outlined="activeMethod !== 'password'"
      :text="activeMethod !== 'password'"
      size="small"
      @click="switchMethod('password')"
    >
      Password
    </PrimeButton>
  </div>
</template>
