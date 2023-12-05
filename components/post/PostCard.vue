<template>
  <div
    v-for="post in store.posts"
    :key="post.id"
    class="grid grid-rows-4 overflow-hidden origin-left scale-x-0 rounded-md shadow-sm animate-swipe-in group"
  >
    <NuxtImg
      :src="
        s.image.single({
          bucket: 'posts',
          folderPath: `${post.id}`,
          file: post.id,
          isPrivate: false
        })
      "
      loading="lazy"
      :alt="post.title"
    />
    <div
      class="relative w-full col-span-1 col-start-1 row-span-2 row-start-3 transition-all duration-500 ease-in-out"
    >
      <div class="absolute bottom-0 w-full p-8 foreground">
        <NuxtLink :to="`/news/article/${post.id}`">
          <button
            class="h-[40px] px-8 bg-[#440439] rounded-md absolute top-[-20px] left-0 right-0 w-[80%] shadow-lg mx-auto font-bold before:content-['Category'] group-hover:before:content-['Read_more']"
          ></button>
        </NuxtLink>
        <h1 class="pb-4 text-2xl font-semibold">
          {{ post.title }}
        </h1>
        <p
          class="text-sm h-[0px] group-hover:h-[100px] overflow-hidden transition-all duration-500 ease-in-out"
        >
          {{ post.body }}
        </p>
        <!-- <p class="mt-4 text-sm"> {{ post.publisheAt }}</p> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = usePostsStore()
const s = useImageStorage()
await store.getPosts()
</script>

<style scoped></style>
