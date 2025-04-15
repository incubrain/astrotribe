<template>
  <div>
    <div class="cf-turnstile"></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  onValidToken: {
    type: Function,
    required: true,
  },
})

const scriptLoaded = ref(false)
const turnstileWidgetId = ref(null)

const emit = defineEmits(['error', 'expired', 'success'])
const colorMode = useColorMode()

const TURNSTILE_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

// Load Turnstile script
useHead({
  script: [
    {
      src: TURNSTILE_URL,
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
  } catch (error: any) {
    console.error('Error validating Turnstile token:', error)
    emit('error', error)
  }
}

const onError = (error: any) => {
  console.error('Turnstile error:', error)
  emit('error', error)
}

const onExpired = () => {
  console.warn('Turnstile token expired')
  emit('expired')
}

const reset = () => {
  const cloudflareCookies = ['__cf_bm', 'cf_clearance', '__cfwaitingroom']

  cloudflareCookies.forEach((cookieName) => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  })

  if (window.turnstile && turnstileWidgetId.value) {
    window.turnstile.reset(turnstileWidgetId.value)
  }
}

const renderTurnstile = () => {
  if (window.turnstile) {
    if (turnstileWidgetId.value) {
      window.turnstile.remove(turnstileWidgetId.value)
    }

    const config = useRuntimeConfig()

    console.log('Rendering Turnstile widget with sitekey:', config)

    turnstileWidgetId.value = window.turnstile.render('.cf-turnstile', {
      'sitekey': config.public.turnstileSiteKey,
      'theme': colorMode.value === 'dark' ? 'dark' : 'light',
      'callback': props.onValidToken,
      'error-callback': onError,
      'expired-callback': onExpired,
    })
  }
}

onMounted(() => {
  if (document.querySelector(`script[src="${TURNSTILE_URL}"]`)) {
    renderTurnstile()
  }

  watch(scriptLoaded, (loaded) => {
    if (loaded) {
      renderTurnstile()
    }
  })
})

// Expose reset method to parent components
defineExpose({ reset })
</script>
