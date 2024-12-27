<template>
  <div class="responsive-tester">
    <button @click="$emit('change', 'mobile')"> Mobile </button>
    <button @click="$emit('change', 'tablet')"> Tablet </button>
    <button @click="$emit('change', 'desktop')"> Desktop </button>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'change', size: 'mobile' | 'tablet' | 'desktop'): void
}>()
</script>

<style scoped>
.responsive-tester {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

button {
  padding: 5px 10px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #e0e0e0;
}
</style>
