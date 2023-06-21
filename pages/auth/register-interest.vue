<template>
  <div class="w-full h-full flex flex-col justify-center items-center px-4">
    <h2 class="text-2xl mb-6 text-center">Register Your Interest</h2>
    <p class="text-center mb-6">
      We are currently in closed alpha, but we appreciate your interest. Please register and we will
      send you an email once we launch our public beta.
    </p>
    <FormDynamic
      :schema="registerInterestData"
      :schema-validation="RegisterInterestValidation"
      class="w-full"
      @submit="handleRegister"
    >
      <FormButton> Register Interest </FormButton>
    </FormDynamic>
  </div>
</template>

<script setup lang="ts">
import { RegisterInterestValidation } from '@/types/zod'
import { registerInterestData } from '@/data/forms'

const auth = useAuth()

const handleRegister = async (value: {
  name: string
  email: string
  referral: string
  interest: string
}) => {
  const { name, email, referral, interest } = value
  const { data, error } = await auth.register.interest({ name, email, referral, interest })

  // Here you would usually send the email to your backend to be saved in your database
  console.log('signed up, redirect', data, error)
}

definePageMeta({
  name: 'RegisterInterest',
  layout: 'auth'
})
</script>
