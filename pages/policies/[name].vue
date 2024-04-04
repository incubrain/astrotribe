<script setup lang="ts">
const route = useRoute()
const name = computed(() => String(route.params.name))

console.log('policy name', name.value)

const { error, data: policy } = await useAsyncData(`policies-${name.value}`, () =>
  queryContent('/policies').where({ _path: route.fullPath }).findOne()
)

if (error.value) {
  console.error(error.value)
}

console.log('policy', policy.value)
</script>

<template>
  <div
    class="grid grid-cols-[minmax(300px,700px)] mx-auto xl:grid-cols-[minmax(240px,1fr)_minmax(660px,740px)_minmax(240px,1fr)] xl:gap-8 justify-center prose lg:prose-xl prose-stone dark:prose-invert pt-32"
  >
    <div class="xl:col-start-2">
      <h1>{{ policy.title }}</h1>
      <ContentRenderer :value="policy">
        <div class="pb-12">
          <div class="mx-auto space-y-8">
            <ContentRendererMarkdown :value="policy.body">
              {{ policy.body }}
            </ContentRendererMarkdown>
          </div>
        </div>
      </ContentRenderer>
    </div>
  </div>
</template>

<style scoped></style>
