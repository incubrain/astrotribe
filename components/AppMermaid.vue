<template>
  <div class="relative h-full">
    <h2>Mermaid Test</h2>
    <pre
    class="text-white"
      ref="el"
      :style="{ display: rendered ? 'block' : 'none' }"
    >
      <slot />
    </pre>
  </div>
</template>

<script setup lang="ts">
const el = ref(null)
const rendered = ref(false)

async function render() {
  if (!el.value) {
    return
  }
  if (el.value.querySelector('svg')) {
    // Already rendered
    return
  }

  // Iterate children to remove comments
  for (const child of el.value.childNodes) {
    if (child.nodeType === Node.COMMENT_NODE) {
      el.value.removeChild(child)
    }
  }
  const { default: mermaid } = await import('mermaid')
  el.value.classList.add('mermaid')
  rendered.value = true
  await mermaid.run({ nodes: [el.value] })
}

onMounted(() => {
  render()
})
</script>

<style scoped>
/* .mermaid rect {
  stroke: #6195ff !important;
  fill: #fff !important;
}

.mermaid .current-doc.node .label {
  color: #fff !important;
}

.mermaid line {
  stroke: #6195ff !important;
} */

.mermaid .flowchart-link {
  stroke: #fff !important;
}

.mermaid .messageText {
  color: #fff !important;
  fill: #fff !important;
  stroke: #fff !important;
}

.mermaid marker {
  fill: #fff !important;
  color: #fff !important;
}

.mermaid line {
  stroke: #fff !important;
}
</style>
