<script setup lang="ts">
import { ref } from 'vue'

const scripts = [
  { name: 'build-all', label: 'Build All', type: 'sh' },
  { name: 'db-setup', label: 'Setup Database', type: 'ts' },
  { name: 'generate-lazy-routes', label: 'Generate Lazy Routes', type: 'ts' },
  { name: 'clean-packages', label: 'Clean Packages', type: 'sh' },
  // Add more scripts as needed
]

const output = ref('')

const executeScript = async (scriptName: string) => {
  try {
    const response = await $fetch('/api/execute-script', {
      method: 'POST',
      body: { scriptName },
    })
    output.value = response.output
  } catch (error: any) {
    console.error('Error executing script:', error)
    output.value = 'Error executing script. Check console for details.'
  }
}
</script>

<template>
  <div class="script-execution-panel">
    <h2>Script Execution Panel</h2>
    <div class="script-buttons flex gap-2">
      <PrimeButton
        v-for="script in scripts"
        :key="script.name"
        :label="`${script.label} (${script.type})`"
        @click="executeScript(script.name)"
      />
    </div>
    <div
      v-if="output"
      class="output-display"
    >
      <h3>Output:</h3>
      <pre>{{ output }}</pre>
    </div>
  </div>
</template>

<style scoped>
/* ... (styles remain the same) ... */
</style>
