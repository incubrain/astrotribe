<template>
  <div>
    <div
      class="cf-turnstile"
      :data-sitekey="config.public.turnstileSiteKey"
      :data-theme="colorMode === 'dark' ? 'dark' : 'light'"
      :data-callback="onSuccess"
      :data-error-callback="onError"
      :data-expired-callback="onExpired"
    ></div>
  </div>
</template>

<script setup>
const props = defineProps({
  onValidToken: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits(['error', 'expired', 'success'])
const config = useRuntimeConfig()
const colorMode = useColorMode()

// Load Turnstile script
useHead({
  script: [
    {
      src: 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit',
      async: true,
      defer: true,
    },
  ],
})

const onSuccess = async (token) => {
  try {
    // Call server API to validate token
    const response = await $fetch('/api/auth/validate-turnstile', {
      method: 'POST',
      body: { token },
    })

    if (response.success) {
      props.onValidToken(token)
      emit('success', token)
    } else {
      console.error('Turnstile validation failed')
      emit('error', new Error('Validation failed'))
    }
  } catch (error) {
    console.error('Error validating Turnstile token:', error)
    emit('error', error)
  }
}

const onError = (error) => {
  console.error('Turnstile error:', error)
  emit('error', error)
}

const onExpired = () => {
  console.warn('Turnstile token expired')
  emit('expired')
}

// Reset method that can be called from parent
const reset = () => {
  if (window.turnstile) {
    window.turnstile.reset()
  }
}

// Expose reset method to parent components
defineExpose({ reset })
</script>
