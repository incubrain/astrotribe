<script setup lang="ts">
type Provider = 'twitter' | 'linkedin'

defineProps({
  provider: {
    type: String as PropType<Provider>,
    required: true
  }
})

const emit = defineEmits(['social-login'])

const socialLogin = () => {
  emit('social-login')
}
</script>

<template>
  <PrimeButton @click="socialLogin">
    <span>
      <Icon
        class="flex justify-center items-center"
        :name="`mdi:${provider}`"
        width="28px"
      />
      Sign in with {{ provider.charAt(0).toUpperCase() + provider.slice(1) }}
    </span>
  </PrimeButton>
</template>
