<template>
  <div class="component-list">
    <h2>Components</h2>
    <input
      v-model="search"
      placeholder="Search components..."
    />
    <ul>
      <li
        v-for="componentName in filteredComponentNames"
        :key="componentName"
      >
        <PrimeButton
          size="small"
          @click="$emit('select', componentName)"
        >
          {{ componentName }}
        </PrimeButton>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  componentNames: string[]
}>()

const emit = defineEmits<{
  (e: 'select', componentName: string): void
}>()

const search = ref('')

const filteredComponentNames = computed(() =>
  props.componentNames.filter((name) => name.toLowerCase().includes(search.value.toLowerCase())),
)
</script>
