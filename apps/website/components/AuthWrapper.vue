<template>
  <div>
    <slot
      name="default"
      :auth-action="handleAuthAction"
      :is-authenticated="isAuthenticated"
      :is-loading="isLoading"
    >
      <PrimeButton
        v-if="!isAuthenticated"
        :class="personaStyles.primaryButton"
        :disabled="isLoading"
        @click="handleAuthAction"
      >
        {{ isLoading ? 'Loading...' : buttonText }}
      </PrimeButton>
      <slot
        v-else
        name="authenticated"
      ></slot>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, useRuntimeConfig } from '#imports'
import { usePersona } from '~/composables/usePersona'

const { personaStyles } = usePersona()

const props = defineProps({
  buttonText: {
    type: String,
    default: 'Sign In',
  },
  redirectUrl: {
    type: String,
    default: '',
  },
  useCurrentUrlAsRedirect: {
    type: Boolean,
    default: true,
  },
  queryParams: {
    type: Object,
    default: () => ({}),
  },
  mode: {
    type: String,
    default: 'login',
    validator: (value: string) => ['login', 'register'].includes(value),
  },
})

const router = useRouter()
const config = useRuntimeConfig()
const isLoading = ref(false)
const isAuthenticated = ref(false)

const redirectTo = computed(() => {
  if (props.redirectUrl) {
    return props.redirectUrl
  }
  if (props.useCurrentUrlAsRedirect && import.meta.client) {
    return window.location.href
  }
  return '/'
})

const handleAuthAction = async () => {
  isLoading.value = true
  try {
    const authBaseUrl = config.public.authUrl || 'http://localhost:3009'
    const authPath = props.mode === 'login' ? '/login' : '/register'
    const encodedRedirect = encodeURIComponent(redirectTo.value)
    const queryParamsObj = {
      redirect_url: encodedRedirect,
      ...props.queryParams,
    }
    const queryString = Object.entries(queryParamsObj)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&')
    const authUrl = `${authBaseUrl}${authPath}?${queryString}`
    window.location.href = authUrl
  } catch (error) {
    console.error(`${props.mode} error:`, error)
  } finally {
    isLoading.value = false
  }
}
</script>
