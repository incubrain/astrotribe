<script setup lang="ts">
type Provider = 'twitter' | 'linkedin'

defineProps({
  provider: {
    type: String as PropType<Provider>,
    required: true,
  },
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
        class="flex items-center justify-center"
        :name="`mdi:${provider}`"
        size="30px"
      />
    </span>
  </PrimeButton>
</template>
