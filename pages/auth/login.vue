<template>
  <div class="flex flex-col items-center justify-center w-full h-full">
    <h2 class="mb-6 text-2xl text-center"> Sign In </h2>
    <FormDynamic
      :schema="loginForm"
      :validation-schema="LoginSchema"
      has-labels
      class="w-full"
      @submit="auth.login"
    >
      <FormButton> Sign In </FormButton>
    </FormDynamic>
    <p class="mt-4 text-sm text-center">
      <NuxtLink to="/auth/forgot-password"> Forgot Password? </NuxtLink>
    </p>
    <!-- <div class="gap-4 w-full mt-6 hidden">
      <UButton
        class="flex items-center justify-center w-full"
        color="white"
        @click="handleProviderSignIn('google')"
      >
        <UIcon
          class="mr-2"
          name="i-mdi-google"
          width="28px"
        />
        Sign In with Google
      </UButton>
      <UButton
        class="flex items-center justify-center w-full"
        color="white"
        @click="handleProviderSignIn('linkedin')"
      >
        <UIcon
          class="mr-2"
          name="i-mdi-linkedin"
          width="28px"
        />
        Sign In with Linkedin
      </UButton>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { LoginSchema } from '@/types/forms'
import loginForm from '@/data/forms/auth/login.json'

const auth = useAuthStore()

const { hash } = useRoute()
const router = useRouter()

const extractFromHash = (paramName: string) => {
  const regex = new RegExp('(?:[&]|^)' + paramName + '=([^&]*)')
  const match = hash.substring(1).match(regex) // Remove the '#' at the beginning of the hash
  return match ? decodeURIComponent(match[1]) : null
}

watch(
  () => hash,
  (newHash: string) => {
    if (newHash.startsWith('#access_token')) {
      console.log('newHash', newHash)
      const session = {
        access_token: String(extractFromHash('access_token')),
        refresh_token: String(extractFromHash('refresh_token')),
        expires_in: Number(extractFromHash('expires_in')),
        token_type: String(extractFromHash('token_type')),
        type: String(extractFromHash('type'))
      }
      console.log('session', session)
      auth.updateSession(session)
      router.push('/astrotribe')
    }
  },
  { immediate: true }
)

definePageMeta({
  name: 'Login',
  layout: 'auth'
})
</script>
