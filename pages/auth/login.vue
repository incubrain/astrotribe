<script setup lang="ts">
const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const auth = useAuth()

const currentUser = useCurrentUser()
const { haveUserSession } = storeToRefs(currentUser)

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
      label: 'Sign up'
    }"
    help-url="/auth/register"
  >
    <template #title>
      <div v-if="haveUserSession">
        <AuthVerifiedWith class="w-full" />

        <div class="w-full pt-4">
          <PrimeDivider
            layout="horizontal"
            class="flex justify-left items-center"
          >
            <p>Or Login with</p>
          </PrimeDivider>
        </div>
      </div>
    </template>
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
      <AuthRegisterWith />
    </template>
  </AuthCard>
</template>
