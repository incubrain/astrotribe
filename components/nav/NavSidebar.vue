<template>
  <div
    class="w-full hidden lg:relative h-full flex-col bg-gray-200 lg:flex py-8 pl-8 "
  >
    <ul class="w-full">
      <li
        v-for="page in pages"
        :key="page.id"
        class="flex w-full justify-between text-gray-700 cursor-pointer items-center"
      >
        <NuxtLink
          :to="page.slug"
          class="flex flex-row items-center justify-center group w-full overflow-hidden"
        >
          <span
            class="w-full p-3 flex items-center justify-start gap-3 rounded-md text-sm"
            :style="
              route.path.split('/')[1] === page.slug.split('/')[1]
                ? { background: '#fff' }
                : { background: 'none' }
            "
          >
            <Icon
              :name="page.icon"
              size="20px"
            />
            {{ page.name }}
          </span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const { pages } = usePages()
const route = useRoute()
</script>

<style scoped></style>
