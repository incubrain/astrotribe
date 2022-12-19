<template>
    <div
        class="bg-gray-200 text-white flex flex-col w-full h-[100vh] justify-center items-center"
    >
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
        <button @click="ce" class="p-14 bg-red-100">testing</button>
    </div>
</template>

<script setup>
// const { authEvents } = useAuth()
// const isEvent = ref(false)

const ce = () => {
    throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
}
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
