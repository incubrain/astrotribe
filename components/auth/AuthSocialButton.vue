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
  <PrimeButton
    :pt="{
      root: 'p-2'
    }"
    @click="socialLogin"
  >
    <span>
      <Icon
        class="flex justify-center items-center"
        :name="`mdi:${provider}`"
        width="30px"
        height="30px"
      />
    </span>
  </PrimeButton>
</template>
