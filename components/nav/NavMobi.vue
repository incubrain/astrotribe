<template>
  <div
    class="relative text-black md:h-full flex-col justify-between"
    >
    <div
    id="openSideBar"
    class="w-10 relative flex flex-col items-center h-full rounded-tr justify-center cursor-pointer"
    @click="mobileNavHandler(!isOpen)"
    >
    <Icon name="cil:hamburger-menu" size="24px" class="relative text-black"/>
  </div>
  <div 
      class="px-8 transition duration-150 ease-in-out top-0 left-0 fixed bg-slate-50 h-[100vh] translate-x-[-260px]" 
      ref="mobileNav"
      >
      <div class="w-full flex pt-15 pb-8">
        <h1 class="text-2xl font-bold">AstroTribe</h1>
        <Icon 
          name="material-symbols:close"
          size="24px"
          class="absolute right-3 top-3 text-black cursor-pointer"
          @click="mobileNavHandler(!isOpen)"
        />
      </div>
      <ul class="flex flex-col items-center w-full">
        <li
        v-for="page in pages"
        :key="page.id"
          class="flex w-full justify-between text-indigo-700 cursor-pointer items-center mb-6 border-2 border-gray-300 py-4 rounded-sm shadow-sm hover:bg-gray-100 hover:text-indigo-900 "
        >
          <div class="flex items-center w-full">
            <span class="text-sm font-semibold w-full text-center">{{  page.name  }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">

const { pages } = usePages()
const route = useRoute()


const mobileNav = ref()
const isOpen = ref(false)

function mobileNavHandler(open) {
  if (open) {
    mobileNav.value.style.transform = "translateX(0px)"
  } else {
    mobileNav.value.style.transform = "translateX(-260px)"
  }
  isOpen.value = open
}

</script>

<style scoped>

</style>
