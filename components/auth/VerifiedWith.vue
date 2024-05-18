<script setup lang="ts">
const currentUser = useCurrentUser()
const { haveUserSession, registeredWithProvider } = storeToRefs(currentUser)
import { useChangeCase } from '@vueuse/integrations/useChangeCase'

const currentProvider = computed(() => {
  return useChangeCase(registeredWithProvider.value, 'capitalCase').value
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
        <PrimeButtonGroup class="flex relative">
          <PrimeButton
            v-if="registeredWithProvider"
            class="flex relative overflow-visible gap-3"
            outlined
          >
            <!-- <Icon
            name="mdi:lock"
            class="w-5 h-5 text-white"
            /> -->
            <Icon
            :name="`mdi:${registeredWithProvider}`"
            class="w-5 h-5 text-primary-700"
            />
            <p> Verified </p>
          </PrimeButton>

          <PrimeButton
            @click="$posthog()?.capture('register_app', { location: 'top_nav' })"
            class="pl-5"
          >
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
