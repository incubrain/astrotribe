<template>
  <v-btn
    color="primary"
    size="large"
  >
    <Icon
      :class="hasIcon ? 'flex' : 'hidden absolute'"
      :name="icon"
    />
    {{ cta }}
  </v-btn>
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
  }
})
</script>

<style scoped></style>
