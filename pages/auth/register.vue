<script setup lang="ts">
const form = reactive({
  email: '',
  password: null as string | null,
  confirmPassword: null as string | null
})

const auth = useAuth()

const isPasswordEntered = computed(() => {
  return !!form.password && !!form.confirmPassword
})

const isPasswordValid = computed(() => {
  return form.password === form.confirmPassword && !!form.password && !!form.confirmPassword
})

definePageMeta({
  name: 'Register',
  layout: 'auth'
})
</script>

<template>
  <AuthCard
    :title="{
      main: 'Create an Account',
      subtitle: 'Already have an account?',
      label: 'Login here.'
    }"
    help-url="/auth/login"
  >
    <template #content>
      <div class="flex flex-col gap-4">
        <PrimeFloatLabel class="flex flex-col w-full">
          <PrimeInputText
            id="email"
            v-model="form.email"
          />
          <label for="email">Email</label>
        </PrimeFloatLabel>
        <div class="flex gap-4 w-full">
          <PrimeFloatLabel class="w-full">
            <PrimePassword
              id="password"
              v-model="form.password"
              :pt="{ root: 'w-full', input: { root: 'w-full' } }"
            >
              <template #footer>
                <PrimeDivider />
                <p class="mt-2">Suggestions</p>
                <ul
                  class="pl-2 ml-2 mt-0"
                  style="line-height: 1.5"
                >
                  <li>At least one lowercase</li>
                  <li>At least one uppercase</li>
                  <li>At least one numeric</li>
                  <li>Minimum 8 characters</li>
                </ul>
              </template>
            </PrimePassword>
            <label for="password">Password</label>
          </PrimeFloatLabel>
          <PrimeFloatLabel class="w-full">
            <PrimePassword
              id="confirmPassword"
              v-model="form.confirmPassword"
              :feedback="false"
              :invalid="!isPasswordValid && isPasswordEntered"
              :pt="{ root: 'w-full', input: { root: 'w-full' } }"
            />
            <label for="confirmPassword">Confirm password</label>
          </PrimeFloatLabel>
        </div>
        <PrimeButton
          class="justify-center"
          :disabled="!isPasswordValid"
          @click="auth.registerWithEmail(form.email, form.password)"
        >
          Sign up with email
        </PrimeButton>
        <PrimeInlineMessage
          severity="error"
          v-show="!isPasswordValid && isPasswordEntered"
        >
          Passwords do not match
        </PrimeInlineMessage>
      </div>
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
      <div class="flex flex-col md:flex-row gap-4 xl:gap-6 w-full">
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
