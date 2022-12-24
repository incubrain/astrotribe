<template>
    <div class="grid grid-rows-4 rounded-md shadow-sm overflow-hidden
        animate-pop-in scale-x-0 origin-left group
    ">
        <img src="/cover.jpg" class=" row-start-1 row-span-3 col-span-1 col-start-1 object-cover object-top shadow-lg h-[360px]">
        <div class=" text-black row-start-3 row-span-2 w-full col-span-1 col-start-1 relative
        transition-all duration-500 ease-in-out">
        <div class="p-8 absolute bottom-0 bg-white">
            <button class="h-[40px] px-8 bg-[#440439] rounded-md absolute top-[-20px] left-0 right-0 w-[80%]
                shadow-lg mx-auto text-white font-bold
                before:content-['Category']
                group-hover:before:content-['Read_more']
                "></button>
            <h1 class="text-2xl font-semibold">Post title blah blah, over a few lines</h1>
            <p class="text-sm h-[0px] group-hover:h-[160px] overflow-hidden transition-all duration-500 ease-in-out"> It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. 
                The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', 
                making it look like readable English. Man</p>
            <p class="text-sm mt-8"> December 12, 2022</p>
        </div>
        </div>
    </div></template>

<script setup lang="ts">



</script>

<style scoped>

</style>