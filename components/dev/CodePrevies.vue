<template>
  <div class="code-preview">
    <h3>Code Preview</h3>
    <pre><code>{{ generatedCode }}</code></pre>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  component: { name: string, component: any }
  props: Record<string, any>
  state: Record<string, any>
}>()

const generatedCode = computed(
  () => `
<template>
  <${props.component.name}
    ${Object.entries(props.props)
        .map(([key, value]) => `:${key}="${JSON.stringify(value)}"`)
        .join('\n    ')}
  />
</template>

<script setup>
import { ref } from 'vue'

${Object.entries(props.state)
    .map(([key, value]) => `const ${key} = ref(${JSON.stringify(value)})`)
    .join('\n')}
<\/script>`,

)
</script>
