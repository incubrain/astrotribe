<template>
  <div class="relative h-full">
    <code
      ref="el"
      class="text-white"
      :style="{ display: rendered ? 'block' : 'none' }"
    >
      <slot />
    </code>
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

  await nextTick()
  const { default: mermaid } = await import('mermaid')

  mermaid.initialize({
    startOnLoad: true,
    theme: 'dark',
    securityLevel: 'loose',
    flowchart: {
      useMaxWidth: false,
      htmlLabels: true,
      defaultRenderer: 'elk', // Use the elk renderer
    },
  })

  el.value.classList.add('mermaid')
  try {
    await mermaid.run({ nodes: [el.value] })
  } catch (error) {
    console.error('Mermaid rendering error:', error)
  }
  rendered.value = true
}

onMounted(() => {
  render()
})
</script>

<style scoped>
.mermaid {
  width: 100%;
  height: 100%;
}
</style>
