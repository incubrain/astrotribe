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
        to="/astrotribe"
      >
        <PrimeButton>
          Visit Dashboard
          <Icon
            name="mdi:play"
            class="h-5 w-5"
          />
        </PrimeButton>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped></style>
