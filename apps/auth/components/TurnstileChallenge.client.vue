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
const config = useRuntimeConfig()
const colorMode = useColorMode()

const TURNSTILE_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

useHead({
  link: [
    {
      rel: 'preload',
      href: TURNSTILE_URL,
      as: 'script',
    },
  ],
  script: [
    {
      src: TURNSTILE_URL,
      async: true,
      defer: true,
      onload: () => {
        scriptLoaded.value = true
      },
      onerror: () => emit('error', new Error('Failed to load Turnstile script')),
    },
  ],
})

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
  const fallback = setTimeout(() => {
    if (!window.turnstile) {
      emit('error', new Error('Turnstile script load timeout'))
    }
  }, 8000)

  watch(scriptLoaded, (loaded) => {
    if (loaded && window.turnstile) {
      clearTimeout(fallback)
      renderTurnstile()
    }
  })
})

// Expose reset method to parent components
defineExpose({ reset })
</script>

<template>
  <div>
    <div class="cf-turnstile"></div>
  </div>
</template>
