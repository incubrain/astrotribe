<template>
  <div class="skeleton-loader" :style="{ width: width, height: height }"></div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';


// todo:med:2 make this robust and test
// todo:consider - should I create a loading slot in my base components to show a loading state?
const width = ref('100%');
const height = ref('100%');

// Props
const props = defineProps({
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: '100%',
  },
});

// Computed properties
const skeletonLoaderStyles = computed(() => ({
  width: props.width,
  height: props.height,
}));

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
