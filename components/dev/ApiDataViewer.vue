<template>
  <div v-if="showComponent">
    <div
      v-tooltip.left="'Page Data Structures'"
      class="fixed bottom-5 right-5 z-50 flex cursor-pointer rounded-full bg-blue-500 p-3 text-white"
      @click="showModal = true"
    >
      <Icon name="ic:baseline-data-object" />
    </div>
    <PrimeDialog
      v-model:visible="showModal"
      modal
      header="API Data Structures"
      class="w-11/12 max-w-6xl"
    >
      <PrimeAccordion
        :multiple="true"
        class="flex flex-col gap-2"
      >
        <PrimeAccordionPanel
          v-for="(structure, url, index) in apiDataStore.apiData"
          :key="url"
          :value="`${index}`"
        >
          <PrimeAccordionHeader
            :pt="{
              root: 'rounded-md border gap-2 border-color flex items-center foreground p-2'
            }"
          >
            <p>
              {{ url }}
            </p>
          </PrimeAccordionHeader>
          <PrimeAccordionContent>
            <pre class="max-h-96 overflow-auto rounded p-4 foreground mt-2">
              {{ JSON.stringify(structure, null, 2) }}
            </pre>
          </PrimeAccordionContent>
        </PrimeAccordionPanel>
      </PrimeAccordion>
    </PrimeDialog>
  </div>
</template>

<script setup lang="ts">
const apiDataStore = useApiDataStore()

const showModal = ref(false)

const isAdmin = ref(true)

const showComponent = computed((): boolean => {
  return process.dev || isAdmin.value
})
</script>
