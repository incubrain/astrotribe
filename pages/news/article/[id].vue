<template>
    <div v-if="post">
        <div class="max-w-[760px] mx-auto flex flex-col prose justify-center">
            <div>
                <div class="my-10 lg:my-10 flex flex-col justify-center">
                    <img :src="post.featuredImage" class="rounded-xl shadow-xl" />
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

const posts = [
    {
        id: 0, 
        title: 'Test post', 
        body: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Man`,  
        featuredImage: '/cover.jpg', 
        published: '24th December 2022' 
    },
    {
        id: 1, 
        title: 'Test post 2', 
        body: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Man`,  
        featuredImage: '/cover.jpg', 
        published: '24th December 2022' 
    }
]

const route = useRoute()
const path = computed(() => route.path)
const post = posts[Number(route.path.split('/').at(-1))] || null

// watch(
//     () => route.path,
//     () => getProject(),
//     { deep: true }
// )
</script>
