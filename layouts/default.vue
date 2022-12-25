<template>
    <div class="bg-gray-200 text-white flex flex-col w-full h-full">
        <div
            class="grid grid-cols-[minmax(160px,220px)_minmax(90%,100%)] w-full h-full"
        >
            <div class="col-start-1 col-span-2 w-full gap-4 md:gap-8 relative z-10">
                <NavTop />
            </div>
            <div
                class="col-start-1 col-span-1 row-start-2 row-span-1 flex w-full h-full relative"
            >
                <NavSidebar class="left-0 top-20 sticky h-[50px] bg-red-50" />
            </div>
            <div class="col-start-2 col-span-1 row-span-1 row-start-2 w-full h-full">
                <div class="p-6">
                    <slot />
                </div>
            </div>
                <!-- <NuxtErrorBoundary @error="someErrorLogger">
                    You use the default slot to render your content
                    <template #error="{ error }">
                        You can display the error locally here.
                        <button @click="error = null">
                            This will clear the error.
                        </button>
                    </template>
                </NuxtErrorBoundary> -->
                <!-- <Footer /> -->
        </div>
    </div>
</template>

<script setup>

const { event } = useEventHandler()
event.auth

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
