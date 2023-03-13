<template>
    <div class="bg-gray-200 text-white flex flex-col w-full h-full">
        <div
            class="w-full h-full"
        >
            <div class="w-full gap-4 md:gap-8 relative z-10">
                <NavTop />
            </div>
            <div class="w-full h-[calc(100vh-60px)] relative overflow-y-scroll">
                <slot />
                <FooterSimple />
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

<script setup lang="ts">

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
