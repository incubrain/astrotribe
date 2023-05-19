<template>
  <div v-if="post">
    <div class="max-w-[760px] mx-auto flex flex-col prose justify-center">
      <div>
        <div class="my-10 lg:my-10 flex flex-col justify-center">
          <img
            :src="post.featuredImage"
            class="rounded-lg shadow-xl"
          />
          <h1 class="text-4xl lg:text-6xl leading-10 text-center">
            {{ post.title }}
          </h1>
          <div class="flex flex-row gap-2items-center justify-center">
            <p class="font-semibold">
              Published: {{ post.published }}
            </p>
          </div>
        </div>
        <div class="max-w-[920px] mx-auto">
          <p class="m-0">
            {{ post.body }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = usePostsStore()

const route = useRoute()
const post = store.postById(Number(route.path.split('/').at(-1))) || null
</script>
