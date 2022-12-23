<template>
    <ul class="flex border-b-[1px] border-gray-300">
        <li class="flex-1"
            v-for="tab in currentTabs"
            :key="tab.id">
            <NuxtLink class="relative block py-2 transition-all duration-300" :to="`/${parentRoute[1] + tab.slug}`" 
                :style="route.name === tab.name ? { background: '#fff' } : { background: 'none' }">
                <div class="flex items-center justify-center text-gray-900" >
                    <Icon :name="tab.icon" size="23px"/>
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


console.log(route.name, currentTabs.value)

</script>

<style scoped></style>
