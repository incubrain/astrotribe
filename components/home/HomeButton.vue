<template>
  <button :class="variant ? 'btn btn-primary text-inverted' : 'btn btn-alt text-base'">
    <Icon
      :class="hasIcon ? 'flex' : 'hidden absolute'"
      :name="icon"
    />
    {{ cta }}
  </button>
</template>

<script setup lang="ts">
defineProps({
  cta: {
    type: String as PropType<string>,
    required: true
  },
  hasIcon: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  icon: {
    type: String as PropType<string>,
    default: ''
  },
  variant: {
    type: Boolean as PropType<boolean>,
    required: true,
    default: true
  }
})
</script>

<style scoped></style>
