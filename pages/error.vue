<template>
  <div>
    <p> {{ props.error }} </p>
    <button @click="handleError">Clear errors</button>
  </div>
</template>

<script setup>
const props = defineProps({
  error: {
    type: Object,
    required: true,
    default: () => {}
  }
})

const handleError = () => clearError({ redirect: '/' })
</script>
