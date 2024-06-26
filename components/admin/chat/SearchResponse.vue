<script setup lang="ts">
import { useChangeCase } from '@vueuse/integrations/useChangeCase'
import katex from 'katex'

const renderLatex = (text: string) => {
  return text.replace(/(\$.*?\$)/g, (match) => {
    try {
      return katex.renderToString(match.replace(/\$/g, ''), {
        throwOnError: true
      })
    } catch (error) {
      console.error('Error rendering LaTeX:', error)
      return `failed(${match})`
    }
  })
}

const chunksStore = useChunksStore()
const { similarChunks } = storeToRefs(chunksStore)
</script>

<template>
  <div
    class="padded-x border-color mx-auto grid h-full max-h-[65vh] w-full flex-grow grid-cols-1 gap-4 overflow-y-scroll rounded-md border p-4 md:grid-cols-2 lg:gap-8 lg:p-8 xl:grid-cols-3"
  >
    <div
      v-for="doc in similarChunks"
      :key="doc.id"
      class="border-color background h-full max-h-[600px] min-h-[600px] space-y-4 overflow-scroll text-wrap rounded-lg border p-4"
    >
      <h4 class="text-xl font-semibold"> {{ useChangeCase(doc.title, 'capitalCase').value }}</h4>
      <div v-html="renderLatex(doc.abstract)"></div>
    </div>
  </div>
</template>

<style>
.katex .katex-html {
  display: none;
}
</style>
