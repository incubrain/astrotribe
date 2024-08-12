<template>
  <div>
    <h1 class="text-3xl">An error occurred</h1>
    <p>{{ error.message }}</p>
    <p>Error ID: {{ error.errorId }}</p>
    <button
      v-if="error.retryAction"
      @click="retryAction"
      >Retry</button
    >
    <button @click="goHome">Go to Home</button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  error: Object
})

const retryAction = () => {
  if (props.error.retryAction) {
    props.error.retryAction()
  }
}

const goHome = () => {
  clearError({ redirect: '/' })
}
</script>
