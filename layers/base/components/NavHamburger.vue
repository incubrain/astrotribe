<!-- components/nav/NavHamburger.vue -->
<template>
  <button
    class="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors flex"
    @click="toggleMobileNav"
  >
    <Icon
      :name="isMobileSidebarOpen ? 'mdi:close' : 'mdi:menu'"
      size="24px"
    />
  </button>
</template>

<script setup lang="ts">
const { isMobileSidebarOpen } = useNavigation()

const toggleMobileNav = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value
}
</script>
