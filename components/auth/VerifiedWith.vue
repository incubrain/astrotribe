<script setup lang="ts">
const currentUser = useCurrentUser()
const { haveUserSession, registeredWithProvider } = storeToRefs(currentUser)
import { useChangeCase } from '@vueuse/integrations/useChangeCase'

const currentProvider = computed(() => {
  return useChangeCase(registeredWithProvider.value, 'capitalCase').value
})

const verifiedIcon = computed(() => {
  if (registeredWithProvider.value === 'email') {
    return 'mdi:email'
  } else if (registeredWithProvider.value === 'google') {
    return 'mdi:google'
  } else if (registeredWithProvider.value === 'facebook') {
    return 'mdi:facebook'
  } else if (registeredWithProvider.value === 'twitter') {
    return 'mdi:twitter'
  } else if (registeredWithProvider.value === 'linkedin_oidc') {
    return 'mdi:linkedin'
  } else {
    return 'mdi:account'
  }
})
</script>

<template>
  <div
    v-if="haveUserSession"
    class="flex items-center justify-start"
  >
    <div class="flex flex-col items-center">
      <NuxtLink
        v-ripple
        @click="$posthog()?.capture('login_app', { location: 'top_nav' })"
        to="/astrotribe"
      >
        <PrimeButtonGroup class="flex relative">
          <PrimeButton
            v-if="registeredWithProvider"
            class="flex relative overflow-visible gap-3"
            outlined
          >
            <Icon
              :name="verifiedIcon"
              class="w-5 h-5 text-primary-700"
            />
            <p class="hidden lg:block"> Verified </p>
          </PrimeButton>

          <PrimeButton class="pl-5">
            Dashboard
            <Icon
              name="mdi:play"
              class="w-5 h-5"
            />
          </PrimeButton>
        </PrimeButtonGroup>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped></style>
