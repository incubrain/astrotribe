<template>
  <div class="w-full h-full flex flex-col justify-center items-center px-4">
    <h2 class="text-2xl mb-6 text-center">Register Your Interest</h2>
    <p class="text-center mb-6">
      We are currently in closed alpha, but we appreciate your interest. Please register and we will send you an email once we launch our public beta.
    </p>
    <FormDynamic
      :schema="registerInterestData"
      :schema-validation="RegisterInterestValidation"
      class="w-full"
      @submit.prevent="handleRegister"
    >
      <UButton
        color="primary"
        size="md"
        class="w-full flex items-center justify-center"
        type="submit"
      >
        Register Interest
      </UButton>
    </FormDynamic>
  </div>
</template>

<script setup lang="ts">
import useAuth from '~/composables/useAuth'
import { RegisterInterestValidation } from '@/types/zod'
import { registerInterestData } from '@/data/forms'

const auth = useAuth()

const handleRegister = async (value: { email: string }) => {
  const { email } = value
  // Here you would usually send the email to your backend to be saved in your database
  console.log(email)
}

async function handleGoogleSignUp() {
  try {
    const { data, error } = await auth.register.withOauth('google')

    if (error) throw error
    console.log('User registered interest via Google', data)
  } catch (error) {
    console.error('Error registering interest via Google', error)
  }
}

definePageMeta({
  name: 'RegisterInterest',
  layout: 'auth'
})
</script>
