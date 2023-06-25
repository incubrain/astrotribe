<template>
  <div v-if="post">
    <div class="max-w-[760px] mx-auto flex flex-col prose justify-center">
      <div>
        <div class="flex flex-col justify-center my-10 lg:my-10">
          <NuxtImg
            class="object-contain p-2 overflow-hidden border-2 rounded-full bg-light w-14 h-14 md:w-20 md:h-20"
            :src="
              s.image.optimized({
                bucket: 'posts',
                folderPath: `${post.id}`,
                file: post.media,
                isPrivate: false,
                transform: { width: 250, height: 250, fit: 'cover', quality: 75 }
              })
            "
            :alt="`${post.title} featured image`"
          />
          <h1 class="text-4xl leading-10 text-center lg:text-6xl">
            {{ post.title }}
          </h1>
          <div class="flex flex-row justify-center gap-2items-center">
            <p class="font-semibold"> Published: {{ post.published }} </p>
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
const s = useStorage()

const route = useRoute()
const post = store.postById(Number(route.path.split('/').at(-1))) || null
</script>
