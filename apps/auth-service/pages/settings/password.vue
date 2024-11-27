<!-- pages/settings/password.vue -->
<script setup lang="ts">
const auth = useAuth()
const toast = useNotification()
const supabase = useSupabaseClient()
const currentUser = useCurrentUser()
const { profile } = storeToRefs(currentUser)

const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
})

const hasEmailProvider = computed(() => {
  return profile.value?.providers?.includes('email')
})

const linkedProviders = computed(() => {
  const providers = profile.value?.providers || []
  return providers
    .filter((p) => p !== 'email')
    .map((provider) => ({
      name: currentUser.formatProviderName(provider),
      icon: currentUser.getProviderIcon(provider),
    }))
})

const providerName = computed(() => {
  const providers = {
    linkedin_oidc: 'LinkedIn',
    twitter: 'Twitter',
    google: 'Google',
    facebook: 'Facebook',
  }
  return providers[registeredWithProvider.value] || registeredWithProvider.value
})

async function handleUpdatePassword() {
  try {
    // First verify current password
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: auth.user.email,
      password: form.currentPassword,
    })

    if (verifyError) {
      toast.error({
        summary: 'Invalid Password',
        message: 'Current password is incorrect',
      })
      return
    }

    // Then update to new password
    await auth.password.update(form.newPassword)

    // Clear form
    form.currentPassword = ''
    form.newPassword = ''
    form.confirmNewPassword = ''
  } catch (error) {
    toast.error({
      summary: 'Update Failed',
      message: error.message,
    })
  }
}
</script>

<template>
  <AuthCard
    no-footer
    :title="{
      main: 'Password Settings',
      subtitle: 'Change your password',
    }"
  >
    <template #content>
      <div
        v-if="!hasEmailProvider"
        class="mb-6"
      >
        <PrimeMessage severity="info">
          <p>Password management is not available as you are only using social login.</p>
          <p class="mt-2">Current login methods:</p>
          <div class="mt-2 flex gap-2">
            <template
              v-for="provider in linkedProviders"
              :key="provider.name"
            >
              <div class="flex items-center gap-1">
                <Icon :name="provider.icon" />
                <span>{{ provider.name }}</span>
              </div>
            </template>
          </div>
        </PrimeMessage>
      </div>

      <form
        v-else
        class="w-full"
        @submit.prevent="handleUpdatePassword"
      >
        <div class="space-y-4">
          <PrimeFloatLabel class="w-full">
            <PrimePassword
              v-model="form.currentPassword"
              class="w-full"
              input-class="w-full"
              required
            />
            <label>Current Password</label>
          </PrimeFloatLabel>

          <PrimeFloatLabel class="w-full">
            <PrimePassword
              v-model="form.newPassword"
              class="w-full"
              input-class="w-full"
              :feedback="true"
              required
            />
            <label>New Password</label>
          </PrimeFloatLabel>

          <PrimeFloatLabel class="w-full">
            <PrimePassword
              v-model="form.confirmNewPassword"
              class="w-full"
              input-class="w-full"
              required
            />
            <label>Confirm New Password</label>
          </PrimeFloatLabel>

          <PrimeButton
            type="submit"
            class="w-full"
          >
            Update Password
          </PrimeButton>
        </div>
      </form>
    </template>
  </AuthCard>
</template>
