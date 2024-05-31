<script setup lang="ts">
definePageMeta({
  layoutTransition: false,
  name: 'Admin',
  middleware: 'is-admin'
})

// const doc = await queryContent('bp')
//   .where({ id: { $eq: 1 } })
//   .findOne()

// console.log('financials: ', financials)

// const { data: financials2 } = await useAsyncData('financials-2', () =>
//   queryContent('/bp/financials-2').findOne()
// )

const businessPlan = [
  { tabTitle: 'Overview', tabName: 'overview' },
  { tabTitle: 'Vision', tabName: 'vision' },
  { tabTitle: 'Financials', tabName: 'financials' },
  { tabTitle: 'Ideas', tabName: 'ideas' }
]

// "Failed to send a request to the Edge Function"
// "FunctionsFetchError: Failed to send a request to the Edge Function\n    at http://localhost:3000/_nuxt/node_modules/.cache/vite/client/deps/chunk-3VNI2S2B.js?v=0fbc9ea7:140:17"
</script>

<template>
  <div class="p-4">
    <!-- <BaseTabView :tabs="businessPlan">
      <template
        v-for="tab in businessPlan"
        v-slot:[tab.tabName]
      >
        <div class="mx-auto max-w-xl py-12">
          <ContentDoc
            :path="`/bp/${tab.tabName}`"
            v-slot="{ doc }"
          >
            <article>
              <ContentRenderer
                :value="doc"
                class="prose prose-invert prose-lg"
              />
            </article>
          </ContentDoc>
        </div>
      </template>
    </BaseTabView> -->
  </div>
</template>

<style scoped></style>
