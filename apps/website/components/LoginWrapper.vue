<template>
  <div>
    <slot
      name="default"
      :login="handleLogin"
      :is-authenticated="isAuthenticated"
      :is-loading="isLoading"
    >
      <!-- Default login button if no slot content provided -->
      <button
        v-if="!isAuthenticated"
        class="btn btn-primary"
        :disabled="isLoading"
        @click="handleLogin"
      >
        {{ isLoading ? 'Loading...' : buttonText }}
      </button>
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

const props = defineProps({
  /**
   * Text to display on the default login button
   */
  buttonText: {
    type: String,
    default: 'Sign In',
  },
  /**
   * URL to redirect to after successful login
   */
  redirectUrl: {
    type: String,
    default: '',
  },
  /**
   * Whether to use the current URL as the redirect URL
   */
  useCurrentUrlAsRedirect: {
    type: Boolean,
    default: true,
  },
  /**
   * Additional query parameters to add to the login URL
   */
  queryParams: {
    type: Object,
    default: () => ({}),
  },
})

const router = useRouter()
const config = useRuntimeConfig()
const isLoading = ref(false)

// Determine if user is authenticated
// This is a simplified check - in a real app, you'd use your auth system
const isAuthenticated = ref(false)

// Compute the redirect URL
const redirectTo = computed(() => {
  if (props.redirectUrl) {
    return props.redirectUrl
  }

  if (props.useCurrentUrlAsRedirect && import.meta.client) {
    // Use current URL as redirect
    return window.location.href
  }

  // Default to homepage
  return '/'
})

// Handle login action
const handleLogin = async () => {
  isLoading.value = true

  try {
    // Construct login URL with redirect
    const authBaseUrl = config.public.authUrl || 'http://localhost:3009'
    const loginPath = '/login'

    // Encode the redirect URL
    const encodedRedirect = encodeURIComponent(redirectTo.value)

    // Build query params
    const queryParamsObj = {
      redirect_url: encodedRedirect,
      ...props.queryParams,
    }

    // Convert query params to URL string
    const queryString = Object.entries(queryParamsObj)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')

    // Construct final URL
    const loginUrl = `${authBaseUrl}${loginPath}?${queryString}`

    // Navigate to login URL
    window.location.href = loginUrl
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>
