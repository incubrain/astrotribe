<template>
    <div 
    v-for="post in store.posts"
    :key="post.id"
    class="grid grid-rows-4 rounded-md shadow-sm overflow-hidden
        animate-swipe-in scale-x-0 origin-left group
    ">
        <img src="/cover.jpg" class=" row-start-1 row-span-3 col-span-1 col-start-1 object-cover object-top shadow-lg h-[320px]">
        <div class=" text-black row-start-3 row-span-2 w-full col-span-1 col-start-1 relative
        transition-all duration-500 ease-in-out">
        <div class="p-8 absolute bottom-0 bg-white w-full">
            <button class="h-[40px] px-8 bg-[#440439] rounded-md absolute top-[-20px] left-0 right-0 w-[80%]
                shadow-lg mx-auto text-white font-bold
                before:content-['Category']
                group-hover:before:content-['Read_more']
                "
                @click="myUndefinedFunction()"></button>
            <h1 class="text-2xl font-semibold pb-4"> {{ post.title }}</h1>
            <p class="text-sm h-[0px] group-hover:h-[100px] overflow-hidden transition-all duration-500 ease-in-out"
            > {{ post.body }}</p>
            <!-- <p class="text-sm mt-4"> {{ post.publisheAt }}</p> -->
        </div>
        </div>
    </div></template>

<script setup lang="ts">

const store = usePostsStore()
await store.getPosts()
// const p = usePostsStore()

</script>

<style scoped>

</style>