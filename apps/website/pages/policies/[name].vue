<script setup lang="ts">
const route = useRoute()
const name = computed(() => String(route.params.name))

// Updated to use queryCollection instead of queryContent
const { error, data: policy } = await useAsyncData(`policies-${name.value}`, () =>
  queryCollection('content').path(`/policies/${name.value}`).first(),
)

if (error.value) {
  console.error(error.value)
}
</script>

<template>
  <div
    class="grid grid-cols-[minmax(300px,700px)] mx-auto xl:grid-cols-[minmax(240px,1fr)_minmax(660px,740px)_minmax(240px,1fr)] xl:gap-8 justify-center prose lg:prose-xl prose-stone prose-invert pt-32"
  >
    <div class="xl:col-start-2">
      <h1>{{ policy?.title }}</h1>
      <ContentRenderer
        v-if="policy"
        :value="policy"
      />
    </div>
  </div>
</template>

<style scoped></style>
