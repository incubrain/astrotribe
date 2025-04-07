<script setup lang="ts">
const props = defineProps({
  article: {
    type: Object,
    required: true,
  },
})

const { data: surroundings } = await useAsyncData(`surroundings-${props.article.path}`, () =>
  queryCollectionItemSurroundings('blog', props.article.path, {
    fields: ['title', 'description', 'path', 'image'],
  }),
)

const prevArticle = computed(() => surroundings.value?.[0] || null)
const nextArticle = computed(() => surroundings.value?.[1] || null)

</script>

<template>
  <div class="my-12 border-t border-b border-primary-800 py-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Previous Article -->
      <NuxtLink
        v-if="prevArticle"
        :to="prevArticle.path"
        class="group flex flex-col p-4 rounded-lg hover:bg-primary-950 transition"
      >
        <div class="text-sm text-gray-400 mb-2 flex items-center gap-1">
          <Icon
            name="i-lucide-arrow-left"
            class="w-4 h-4"
          />
          <span>Previous Article</span>
        </div>
        <h3 class="font-medium text-lg group-hover:text-primary-400 transition line-clamp-2">
          {{ prevArticle.title }}
        </h3>
        <p
          v-if="prevArticle.description"
          class="text-sm text-gray-400 mt-1 line-clamp-2"
        >
          {{ prevArticle.description }}
        </p>
      </NuxtLink>
      <div
        v-else
        class="hidden md:block"
      ></div>

      <!-- Next Article -->
      <NuxtLink
        v-if="nextArticle"
        :to="nextArticle.path"
        class="group flex flex-col p-4 rounded-lg hover:bg-primary-950 transition md:text-right md:items-end"
      >
        <div class="text-sm text-gray-400 mb-2 flex items-center gap-1 md:justify-end">
          <span>Next Article</span>
          <Icon
            name="i-lucide-arrow-right"
            class="w-4 h-4"
          />
        </div>
        <h3 class="font-medium text-lg group-hover:text-primary-400 transition line-clamp-2">
          {{ nextArticle.title }}
        </h3>
        <p
          v-if="nextArticle.description"
          class="text-sm text-gray-400 mt-1 line-clamp-2"
        >
          {{ nextArticle.description }}
        </p>
      </NuxtLink>
    </div>
  </div>
</template>
