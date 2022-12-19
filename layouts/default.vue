<template>
    <div class="bg-gray-200 text-white flex flex-col w-full h-[100vh]">
        <div
            class="grid grid-cols-[minmax(160px,400px)_minmax(780px,90%)] h-full w-full"
        >
            <div
                class="col-start-1 col-span-1 row-start-1 row-span-2 w-full h-full relative"
            >
                <NavSidebar class="sticky w-[100vh] left-0 top-0" />
            </div>
            <div class="col-start-2 col-span-2 w-full gap-4 md:gap-8">
                <NavTop />
                <NuxtErrorBoundary @error="someErrorLogger">
                    <!-- You use the default slot to render your content -->
                    <slot />
                    <template #error="{ error }">
                        You can display the error locally here.
                        <button @click="error = null">
                            This will clear the error.
                        </button>
                    </template>
                </NuxtErrorBoundary>
                <Footer />
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style>
/*
Layout transition animation
https://nuxt.com/docs/getting-started/transitions
*/
.layout-enter-active,
.layout-leave-active {
    transition: all 0.4s;
}

.layout-enter-from,
.layout-leave-to {
    opacity: 0;
    filter: blur(1rem);
}
</style>
