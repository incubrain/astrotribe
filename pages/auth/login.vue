<script setup lang="ts">
const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

// type Provider = 'twitter' | 'linkedin' | 'email'

// const handleLogin = async (provider: Provider) => {
//   let body = null

//   if (provider === 'email') {
//     console.log('email')
//     body = { email: form.email, password: form.password }
//   }

//   const data = await $fetch(`/api/auth/login/${provider}`, {
//     method: 'POST',
//     headers: useRequestHeaders(['cookie']),
//     body
//   })

//   if (!data.user) {
//     console.error('Login Error: No data returned from supabase')
//     return
//   }

//   if (provider === 'linkedin' || provider === 'twitter') {
//     window.location.href = data.user.url
//   }
// }

const auth = useAuth()

definePageMeta({
  name: 'Login',
  layout: 'auth'
})
</script>

<template>
  <AuthCard
    :title="{
      main: 'Login to AstronEra',
      subtitle: 'Don\'t have an account?',
      label: 'Sign in.'
    }"
    help-url="/auth/login"
  >
    <template #content>
      <PrimeFloatLabel class="flex flex-col w-full">
        <PrimeInputText
          id="username"
          v-model="form.email"
        />
        <label for="username">Username</label>
      </PrimeFloatLabel>

      <PrimeFloatLabel>
        <FormPassword v-model="form.password" />
        <label for="password">Password</label>
      </PrimeFloatLabel>

      <div class="w-full py-2 flex justify-between">
        <div class="flex gap-2 items-center">
          <PrimeCheckbox
            v-model="form.rememberMe"
            :binary="true"
            value="newsletter"
          />
          <label
            for="ingredient1"
            class="text-sm"
          >
            Newsletter signup
          </label>
        </div>

        <p class="text-sm">
          <NuxtLink to="/auth/forgot-password"> Forgot Password? </NuxtLink>
        </p>
      </div>

      <PrimeButton
        class="justify-center"
        @click="auth.loginWithEmail(form.email, form.password)"
      >
        Sign in with email
      </PrimeButton>
    </template>
    <template #footer>
      <div class="w-full">
        <PrimeDivider
          layout="horizontal"
          class="flex justify-left items-center"
        >
          <p>Or continue with</p>
        </PrimeDivider>
      </div>
      <div class="flex gap-4 xl:gap-6 w-full pt-4">
        <AuthSocialButton
          provider="twitter"
          @social-login="auth.loginSocial('twitter')"
        />
        <AuthSocialButton
          provider="linkedin"
          @social-login="auth.loginSocial('linkedin_oidc')"
        />
      </div>
    </template>
  </AuthCard>
</template>
