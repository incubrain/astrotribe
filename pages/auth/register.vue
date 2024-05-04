<script setup lang="ts">
const form = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

const auth = useAuth()

const isPasswordInvalid = computed(() => {
  return form.password !== form.confirmPassword
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
        <div class="flex gap-4 w-full">
          <PrimeFloatLabel class="w-full">
            <PrimeInputText
              class="w-full"
              id="given_name"
              v-model="form.given_name"
            />
            <label for="given_name">Given Name</label>
          </PrimeFloatLabel>
          <PrimeFloatLabel class="w-full">
            <PrimeInputText
              id="surname"
              v-model="form.surname"
              class="w-full"
            />
            <label for="surname">Surname</label>
          </PrimeFloatLabel>
        </div>
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
              class="w-full"
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
              :pt="{ root: 'w-full', input: 'w-full' }"
            />
            <label for="confirmPassword">Confirm password</label>
          </PrimeFloatLabel>
        </div>
        <PrimeButton
          class="justify-center"
          :disabled="isPasswordInvalid"
          @click="auth.registerWithEmail(form.email, form.password)"
        >
          Sign up with email
        </PrimeButton>
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
