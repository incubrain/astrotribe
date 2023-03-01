<template>
  <div
    class="w-full hidden md:relative h-full flex-col lg:flex pb-6 border-r border-gray-300"
  >
    <div class="flex pl-4 pt-8">
      <ul>
        <li
        v-for="page in pages"
        :key="page.id"
          class="flex w-full justify-between text-gray-700 cursor-pointer items-center mb-6 rounded-lg transition-all duration-300"
          >
          <div class="flex items-center">
            <NuxtLink :to="page.slug" class="flex flex-row items-center justify-center group">
              <div
              class="rounded-full p-[6px] ml-[-6px]"
                :style="route.path.split('/')[1] === page.slug.split('/')[1] ? { background: '#fff'} : { background: 'none' }"
              >
                <Icon :name="page.icon"
                  size="23px"
                />
              </div>
              <span
                  class="ml-6 text-sm font-normal px-4 py-2 leading-none 
                  group-hover:bg-[#fff] group-hover:rounded-lg transition-all
                  "
                > {{  page.name  }} </span>
            </NuxtLink>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">

const { pages } = usePages()
const route = useRoute()

</script>

<style scoped>

</style>
