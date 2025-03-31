<script setup lang="ts">
const auth = useAuth()

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  layout: {
    type: String,
    default: 'row', // 'row' or 'column'
    validator: (value: string) => ['row', 'column'].includes(value),
  },
})

const isLoading = reactive({
  google: false,
  twitter: false,
  linkedin: false,
})

async function handleSocialLogin(provider: 'google' | 'twitter' | 'linkedin_oidc') {
  const providerKey = provider === 'linkedin_oidc' ? 'linkedin' : provider

  try {
    isLoading[providerKey] = true
    await auth.loginSocial(provider)
  } finally {
    // Reset loading state after 3 seconds to handle redirect cases
    setTimeout(() => {
      isLoading[providerKey] = false
    }, 3000)
  }
}

const containerClass = computed(() => {
  return props.layout === 'column'
    ? 'flex flex-col gap-3 w-full'
    : 'flex flex-row gap-4 w-full justify-center'
})

const buttonClass = computed(() => {
  return props.layout === 'column' ? 'w-full justify-center py-3  ' : ''
})
</script>

<template>
  <div class="w-full">
    <div :class="containerClass">
      <!-- Google (Primary) -->
      <PrimeButton
        :class="buttonClass"
        :disabled="props.disabled || isLoading.google"
        :loading="isLoading.google"
        class="flex items-center gap-2"
        @click="handleSocialLogin('google')"
      >
        <Icon
          name="mdi:google"
          size="20px"
        />
        <span v-if="layout === 'column'">Continue with Google</span>
      </PrimeButton>

      <!-- Twitter -->
      <PrimeButton
        :class="buttonClass"
        :disabled="props.disabled || isLoading.twitter"
        :loading="isLoading.twitter"
        class="flex items-center gap-2"
        @click="handleSocialLogin('twitter')"
      >
        <Icon
          name="mdi:twitter"
          size="20px"
        />
        <span v-if="layout === 'column'">Continue with Twitter</span>
      </PrimeButton>

      <!-- LinkedIn -->
      <PrimeButton
        :class="buttonClass"
        :disabled="props.disabled || isLoading.linkedin"
        :loading="isLoading.linkedin"
        class="flex items-center gap-2"
        @click="handleSocialLogin('linkedin_oidc')"
      >
        <Icon
          name="mdi:linkedin"
          size="20px"
        />
        <span v-if="layout === 'column'">Continue with LinkedIn</span>
      </PrimeButton>
    </div>
  </div>
</template>
