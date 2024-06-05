<script setup lang="ts">
defineProps({
  doc: {
    type: Object,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  showClean: {
    type: Boolean,
    default: false
  }
})

const chunksStore = useChunksStore()
</script>

<template>
  <PrimeCard>
    <template #header>
      <div class="px-6 pt-4 flex gap-4">
        <slot name="header" />
      </div>
    </template>
    <template #content>
      <div class="flex flex-col gap-4">
        <div class="flex gap-2 items-center">
          <PrimeTag>id: {{ doc.research_id }}</PrimeTag>
          <PrimeTag>
            raw length:
            {{ body.length }}
          </PrimeTag>
          <PrimeTag>
            clean length:
            {{ chunksStore.cleanText(body).length }}
          </PrimeTag>
        </div>
        <p>{{ showClean ? chunksStore.cleanText(body) : body }}</p>
        <div> 
          <slot name="content" />
        </div>
        <NuxtLink
          class="text-primary py-2 px-3 border border-primary-700 bg-primary-950/50 rounded-lg"
          :to="doc.url"
          target="_blank"
          external
          >Ref: {{ doc?.url }}</NuxtLink
        >
      </div>
    </template>
  </PrimeCard>
</template>

<style scoped></style>
