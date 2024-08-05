<script setup lang="ts">
// remove /n from all abstracts, replace with space
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

interface Doc {
  body: string
  id: string
  url: string
  title?: string
  published_at?: string
}

const props = defineProps({
  doc: {
    type: Object as PropType<Doc>,
    required: true
  },
  showLatex: {
    type: Boolean,
    default: false
  }
})

const chunksStore = useChunksStore()

const processedBody = computed(() => {
  return props.showLatex
    ? props.doc.body.replace(/\$(.*?)\$/g, (match, p1) => renderLatex(p1))
    : props.doc.body
})
</script>

<template>
  <PrimeCard>
    <template #header>
      <div class="flex gap-4 px-6 pt-4">
        <slot name="header" />
        <NuxtLink
          :to="doc.url"
          target="_blank"
          external
        >
          <PrimeButton outlined>Source</PrimeButton>
        </NuxtLink>
      </div>
    </template>
    <template #content>
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2 flex-wrap">
          <PrimeTag>
            length:
            {{ doc.body.length }}
          </PrimeTag>
          <PrimeTag>
            {{ useDateFormat(doc.published_at, 'YYYY-MM-DD').value }}
          </PrimeTag>
          <slot name="tags" />
        </div>
        <h4
          v-if="doc.title"
          class="text-xl font-semibold"
        >
          {{ doc.title }}</h4
        >
        <p
          v-html="processedBody"
          class="text-sm"
        ></p>
        <div>
          <slot name="content" />
        </div>
      </div>
    </template>
  </PrimeCard>
</template>

<style>

</style>
