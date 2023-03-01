<template>
    <div
        class="flex flex-row justify-center items-center w-full shadow-sm bg-white relative rounded-[100rem_0_0_100rem] py-[10px] max-h-[100px]"
    >
        <img
            src="/avatar.png"
            class="rounded-full h-[80px] ml-[10px] aspect-square"
        />
        <div
            class="text-black w-full relative transition-all duration-500 ease-in-out"
        >
            <div class="flex flex-col pl-8 bottom-0 bg-white rounded-3xl">
                <h1 class="text-2xl font-semibold">Drew MacGibbon</h1>
                <div class="flex">
                    <p class="text-sm">Astro nerd</p>
                    <p class="text-sm pl-4">pune</p>
                </div>
            </div>
        </div>
        <div class="absolute right-0 flex flex-col h-full gap-[2px]">
            <button
                class="h-full px-4 bg-[#440404] mx-auto text-white font-bold"
            >
                Profile
            </button>
            <button
                class="h-full px-4 bg-[#440404] mx-auto text-white font-bold"
            >
                Follow
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped></style>
