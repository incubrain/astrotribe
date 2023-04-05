<template>
  <div class="relative text-black md:h-full flex-col justify-between">
    <div
      id="openSideBar"
      class="w-10 relative flex flex-col items-center h-full rounded-tr justify-center cursor-pointer"
      @click="mobiOpenClose(!isOpen)"
    >
      <Icon
        name="cil:hamburger-menu"
        size="24px"
        class="relative text-black"
      />
    </div>
    <div
      ref="mobileNav"
      :class="
        !isOpen
          ? 'px-8 transition duration-250 ease-in-out top-0 left-0 fixed bg-slate-50 h-[100vh] translate-x-[-100%]'
          : 'px-8 transition duration-250 ease-in-out top-0 left-0 fixed bg-slate-50 h-[100vh] w-[50%]'
      "
    >
      <div class="w-full flex pt-15 pb-8">
        <h1 class="text-2xl font-bold">AstroTribe</h1>
        <Icon
          name="material-symbols:close"
          size="24px"
          class="absolute right-3 top-3 text-black cursor-pointer"
          @click="mobiOpenClose(!isOpen)"
        />
      </div>
      <ul class="flex flex-col items-center w-full">
        <li
          v-for="page in pages"
          :key="page.id"
          class="flex w-full justify-between cursor-pointer items-center mb-6 border-b-2 border-gray-300 py-4 rounded-sm shadow-sm"
        >
          <div class="flex items-center w-full">
            <span class="text-sm font-semibold w-full text-center">{{ page.name }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const { pages } = usePages()
// const route = useRoute()

const mobileNav = ref<HTMLDivElement | null>(null)
const isOpen = ref(false)

function mobiOpenClose(open = false as boolean): void {
  if (mobileNav.value === null) return
  console.log('firexx')
  isOpen.value = open
}

onClickOutside(mobileNav, (event) => {
  console.log('fire', event)
  mobiOpenClose(false)
})
</script>

<style scoped></style>
