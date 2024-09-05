<template>
  <div
    class="skeleton-loader"
    :style="{ width: loaderWidth, height: loaderHeight }"
  ></div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const loaderWidth = ref('100%')
const loaderHeight = ref('100%')

defineProps({
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: '100%',
  },
})
</script>

<style scoped>
.skeleton-loader {
  background-color: #f3f3f3;
  animation: skeleton-loading 1s infinite linear;
}

@keyframes skeleton-loading {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: 200px 0;
  }
}
</style>
