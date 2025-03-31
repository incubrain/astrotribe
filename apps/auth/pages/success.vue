<script setup lang="ts">
const userStore = useCurrentUser()
const { profile } = storeToRefs(userStore)
const countdown = ref(60)
const timer = ref(null)

onMounted(() => {
  // Start a countdown timer
  timer.value = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer.value)
    }
  }, 1000)
})

onBeforeUnmount(() => {
  // Clear the timer when component is destroyed
  if (timer.value) {
    clearInterval(timer.value)
  }
})

definePageMeta({
  name: 'Success',
})
</script>

<template>
  <div class="max-w-md mx-auto p-6">
    <PrimeCard class="border border-primary-700/30">
      <template #title>
        <div class="flex items-center gap-2 justify-center">
          <Icon
            name="mdi:check-circle"
            class="text-green-500"
            size="28px"
          />
          <h2 class="text-2xl font-bold text-primary-400">Registration Successful!</h2>
        </div>
      </template>

      <template #content>
        <div class="pt-2 flex flex-col gap-4">
          <PrimeMessage
            severity="info"
            class="mb-4 w-full"
          >
            <div class="flex flex-col gap-2">
              <p>Please confirm your email to complete your registration.</p>
              <p class="text-sm">We've sent a verification link to:</p>
              <p class="font-medium">{{ profile?.email }}</p>
            </div>
          </PrimeMessage>

          <div class="space-y-4">
            <h3 class="text-lg font-semibold">What happens next?</h3>
            <ol class="list-decimal ml-5 space-y-2">
              <li>Check your email inbox (and spam folder)</li>
              <li>Click the verification link in the email</li>
              <li>After verification, you'll be redirected to complete your profile</li>
              <li>Start exploring the Astronomy Hub!</li>
            </ol>

            <div class="mt-6 space-y-2">
              <p class="font-medium">Common email providers:</p>
              <div class="flex flex-wrap gap-2">
                <PrimeButton
                  outlined
                  size="small"
                  class="flex items-center gap-1"
                  @click="window.open('https://mail.google.com', '_blank')"
                >
                  <Icon name="mdi:gmail" />
                  <span>Gmail</span>
                </PrimeButton>

                <PrimeButton
                  outlined
                  size="small"
                  class="flex items-center gap-1"
                  @click="window.open('https://outlook.live.com/mail/0/inbox', '_blank')"
                >
                  <Icon name="mdi:microsoft-outlook" />
                  <span>Outlook</span>
                </PrimeButton>

                <PrimeButton
                  outlined
                  size="small"
                  class="flex items-center gap-1"
                  @click="window.open('https://mail.yahoo.com/', '_blank')"
                >
                  <Icon name="mdi:yahoo" />
                  <span>Yahoo</span>
                </PrimeButton>
              </div>
            </div>
          </div>

          <PrimeDivider />

          <div class="text-center">
            <p
              v-if="countdown > 0"
              class="text-sm text-gray-400"
            >
              Email not arriving? You can request a new one in {{ countdown }} seconds
            </p>
            <PrimeButton
              v-else
              label="Resend Verification Email"
              class="mt-2"
              @click="navigateTo('/forgot-password')"
            />
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex flex-col items-center gap-3 mt-4">
          <p class="text-sm text-gray-400">
            Need help? Contact
            <a
              href="mailto:support@astronera.org"
              class="text-primary hover:underline"
              >support@astronera.org</a
            >
          </p>
        </div>
      </template>
    </PrimeCard>
  </div>
</template>
