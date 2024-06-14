<template>
  <div>
    <div v-html="renderedMathContent"></div>
    <div v-if="latexArray.length">
      <div
        v-for="(latex, index) in latexArray"
        :key="index"
      >
        <div v-html="renderLatex(latex)"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import katex from 'katex'

const renderLatex = (latex: string) => {
  try {
    return katex.renderToString(latex, {
      throwOnError: false
    })
  } catch (error) {
    console.error('Error rendering LaTeX:', error)
    return ''
  }
}

module.exports = { renderLatex }

const latexArray = ref(['\\frac{a}{b}', '\\sqrt{2}', 'E = mc^2'])

const renderedMathContent = ref('')

const renderMath = () => {
  renderedMathContent.value = latexArray.value.map((latex) => renderLatex(latex)).join('<br>')
}

onMounted(() => {
  renderMath()
})
</script>
