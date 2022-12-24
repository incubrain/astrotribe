<template>
    <ul>
        <li class="flex flex-1 transition-all duration-300 mb-[-1px] items-center"
            v-for="tab in currentTabs"
            :style="route.name === tab.name ? { 'border-bottom': '1px solid blue' } : { 'border-bottom': 'none'  }"
            :key="tab.id">
            <NuxtLink class="relative block py-2 rounded-lg w-full transition-all duration-300 animate-pop-in scale-90" :to="`/${parentRoute[1] + tab.slug}`" 
                :style="route.name === tab.name ? { background: '#E5E7EB' } : { background: 'none'  }"
                >
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
