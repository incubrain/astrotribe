<script setup lang="ts">
type Provider = 'twitter' | 'linkedin'

const props = defineProps({
  disabled: {
    type: Boolean,
    required: true,
  },
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
  <PrimeButton
    :disabled="props.disabled"
    @click="socialLogin"
  >
    <span>
      <Icon
        class="flex items-center justify-center"
        :name="`mdi:${provider}`"
        size="30px"
      />
    </span>
  </PrimeButton>
</template>
