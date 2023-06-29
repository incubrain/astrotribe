<template>
  <div class="flex flex-col items-center justify-center w-full h-full px-4">
    <h2 class="mb-6 text-2xl text-center">
      Register Your Interest
    </h2>
    <h4 class="mb-6 text-center">
      We are currently in closed alpha, but we appreciate your interest. Please register and we will
      send you an email once we launch our public beta.
    </h4>
    <FormDynamic
      :schema="registerInterestData"
      :validation-schema="RegisterInterestValidation"
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
  console.log('data: ', data, error)
  if (error !== null) console.error('error registering interest: ', error.value)
  else {
    console.info('User registered interest: ', data.value)
    const router = useRouter()
    router.push('/auth/register-interest-success')
  }
}

definePageMeta({
  name: 'RegisterInterest',
  layout: 'auth'
})
</script>
