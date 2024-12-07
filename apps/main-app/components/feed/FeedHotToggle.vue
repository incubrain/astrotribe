<script setup lang="ts">
const props = defineProps<{
  modelValue: 'created_at' | 'hot_score'
}>()

const emit = defineEmits<{
  'update:modelValue': ['created_at' | 'hot_score']
}>()

const isAnimating = ref(false)

function handleToggle(value: 'created_at' | 'hot_score') {
  emit('update:modelValue', value)
  if (value === 'hot_score') {
    isAnimating.value = true
    setTimeout(() => {
      isAnimating.value = false
    }, 1000)
  }
}
</script>

<template>
  <div class="flex justify-center gap-4 p-8">
    <button
      class="px-4 py-2 rounded-md transition-colors duration-200"
      :class="{
        'bg-blue-600 text-white hover:bg-blue-700': modelValue === 'created_at',
        'bg-gray-100 text-gray-700 hover:bg-gray-200': modelValue !== 'created_at',
      }"
      @click="handleToggle('created_at')"
    >
      <div class="flex items-center gap-2">
        <span>Latest</span>
        <Icon
          name="material-symbols:hourglass-top"
          size="22px"
        />
      </div>
    </button>

    <button
      class="px-4 py-2 rounded-md transition-colors duration-200"
      :class="{
        'bg-red-600 text-white hover:bg-red-700': modelValue === 'hot_score',
        'bg-gray-100 text-gray-700 hover:bg-gray-200': modelValue !== 'hot_score',
      }"
      @click="handleToggle('hot_score')"
    >
      <div class="flex items-center gap-2">
        <span>Hot</span>
        <Icon
          name="mdi:fire"
          size="22px"
          class="transition-transform"
          :class="{
            'animate-wiggle': isAnimating,
          }"
        />
      </div>
    </button>
  </div>
</template>

<style scoped>
@keyframes wiggle {
  0% {
    transform: rotate(0deg) scale(1);
  }
  25% {
    transform: rotate(-12deg) scale(1.2);
  }
  50% {
    transform: rotate(10deg) scale(1.1);
  }
  75% {
    transform: rotate(-8deg) scale(1.1);
  }
  100% {
    transform: rotate(0deg) scale(1);
  }
}

.animate-wiggle {
  animation: wiggle 1s ease-in-out;
}
</style>
