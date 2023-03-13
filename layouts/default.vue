<template>
    <div class="bg-gray-200 text-white flex flex-col w-full h-full">
        <div
            class="w-full h-full
            lg:grid-cols-[60px_minmax(90%,100%)] lg:grid "
        >
            <div class="lg:col-start-1 lg:col-span-2 w-full gap-4 md:gap-8 relative z-10">
                <NavTop />
            </div>
            <div
                class="lg:col-start-1 lg:col-span-1 lg:row-start-2 lg:row-span-1 flex w-full h-full relative overflow-hidden bg-[#E5E7EB]
                hover:w-[165px] hover:overflow-visible z-50 transition-all"
            >
                <NavSidebar class="left-0 sticky top-0" />
            </div>
            <div class="lg:col-start-2 lg:col-span-1 lg:row-span-1 lg:row-start-2 w-full h-[calc(100vh-60px)] overflow-y-scroll p-8 relative">
                <div class="max-w-[1280px] mx-auto">
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
