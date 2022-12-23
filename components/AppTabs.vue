<template>
    <ul class="flex border-b border-gray-100 mb-6">
        <li class="flex-1"
            v-for="tab in currentTabs"
            :key="tab.id">
            <NuxtLink class="relative block p-4" :to="`/${parentRoute[1] + tab.slug}`">
                <span
                    class="absolute inset-x-0 -bottom-px h-px w-full bg-gray-300"
                ></span>

                <div class="flex items-center justify-center text-gray-900">
                    <Icon :name="tab.icon" size="24px"/>
                    <span class="ml-3 text-sm font-medium">
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
