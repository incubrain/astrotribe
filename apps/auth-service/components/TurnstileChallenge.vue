<template>
  <div>
    <div class="cf-turnstile"></div>
  </div>
</template>

<script setup>
const props = defineProps({
  onValidToken: {
    type: Function,
    required: true,
  },
})

const scriptLoaded = ref(false)

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
      onload: () => {
        console.log('Turnstile script loaded successfully')
        scriptLoaded.value = true
      },
      onerror: () => {
        console.error('Failed to load Turnstile script')
      },
    },
  ],
})

const onSuccess = async (token) => {
  try {
    // Call server API to validate token
    const response = await $fetch('/validate-turnstile', {
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

const reset = () => {
  if (window.turnstile) {
    window.turnstile.reset()
  }
}

onMounted(() => {
  watch(scriptLoaded, (loaded) => {
    if (loaded) {
      renderTurnstile()
    }
  })
})

const renderTurnstile = () => {
  if (window.turnstile) {
    window.turnstile.render('.cf-turnstile', {
      'sitekey': config.public.turnstileSiteKey,
      'theme': colorMode.value === 'dark' ? 'dark' : 'light',
      'callback': onSuccess,
      'error-callback': onError,
      'expired-callback': onExpired,
    })
  }
}

// Expose reset method to parent components
defineExpose({ reset })
</script>
