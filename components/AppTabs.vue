<template>
  <ul class="flex justify-center">
    <li
      v-for="tab in currentTabs"
      :key="tab.id"
      class="flex flex-1 transition-all duration-300 mb-[-1px] items-center max-w-[180px]"
      :style="
        route.name === tab.label
          ? { 'border-bottom': '1px solid blue' }
          : { 'border-bottom': 'none' }
      "
    >
      <NuxtLink
        class="relative block w-full py-2 transition-all duration-300 scale-90 rounded-lg animate-pop-in"
        :to="`/${parentRoute[1] + tab.slug}`"
        :style="route.name === tab.label ? { background: '#E5E7EB' } : { background: 'none' }"
      >
        <div class="flex items-center justify-center text-gray-900">
          <Icon
            :name="tab.icon"
            class="w-5 h-5"
          />
          <span class="ml-3 text-sm font-medium">
            {{ tab.label }}
          </span>
        </div>
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup lang="ts">
// todo:high:2 - convert this to a base component
const route = useRoute()
const { tabs } = usePages()

const parentRoute = computed(() => route.path.split('/'))
const currentTabs = computed(() => tabs(parentRoute.value[1])?.children)
</script>

<style scoped></style>
