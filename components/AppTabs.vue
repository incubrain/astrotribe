<template>
    <ul class="flex border-b border-gray-100 mb-6">
        <li class="flex-1"
            v-for="tab in currentTabs"
            :key="tab.id">
            <NuxtLink class="relative block p-4" :to="`/${parentRoute[1] + tab.slug}`">
                <span
                    class="absolute inset-x-0 -bottom-px h-px w-full bg-pink-600"
                ></span>

                <div class="flex items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 flex-shrink-0 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                        />
                    </svg>

                    <span class="ml-3 text-sm font-medium text-gray-900">
                        {{ tab.name }}
                    </span>
                </div>
            </NuxtLink>
        </li>
    </ul>
</template>

<script setup lang="ts">

const route = useRoute()
const { tabs } = usePages()

const parentRoute = computed(() => route.path.split('/'))
const currentTabs = computed(() => tabs(parentRoute.value[1])?.children)


</script>

<style scoped></style>
