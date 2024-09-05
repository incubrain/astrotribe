<template>
  <div
    v-for="article in store.articles"
    :key="article.id"
    class="group grid origin-left scale-x-0 animate-swipe-in grid-rows-4 overflow-hidden rounded-md shadow-sm"
  >
    <IBImage
      :img="{
        src: s.image.single({
          bucket: 'articles',
          folderPath: `${article.id}`,
          file: article.id,
          isPrivate: false,
        }),
        alt: article.title,
        loading: 'lazy',
      }"
    />
    <div
      class="relative col-span-1 col-start-1 row-span-2 row-start-3 w-full transition-all duration-500 ease-in-out"
    >
      <div class="foreground absolute bottom-0 w-full p-8">
        <NuxtLink :to="`/news/article/${article.id}`">
          <button
            class="absolute left-0 right-0 top-[-20px] mx-auto h-[40px] w-[80%] rounded-md bg-[#440439] px-8 font-bold shadow-lg before:content-['Category'] group-hover:before:content-['Read_more']"
          ></button>
        </NuxtLink>
        <h1 class="pb-4 text-2xl font-semibold">
          {{ article.title }}
        </h1>
        <p
          class="h-[0px] overflow-hidden text-sm transition-all duration-500 ease-in-out group-hover:h-[100px]"
        >
          {{ article.body }}
        </p>
        <!-- <p class="mt-4 text-sm"> {{ article.publisheAt }}</p> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useArticlesStore()
const s = useStorage()
await store.getArticles()
// const p = useArticlesStore()
</script>

<style scoped></style>
