<script setup>
import { usePrimeVue } from 'primevue/config'
const mode = useColorMode()

const PrimeVue = usePrimeVue()
const isDark = computed(() => true)
// const isDark = computed(() => mode.preference === 'dark')

const toggle = () => {
  mode.preference = isDark.value = true
}

const darkTheme = 'aura-dark-teal'
const lightTheme = 'aura-light-teal'

watch(
  isDark,
  (isDarkNow) => {
    if (isDarkNow) {
      console.log('going dark')
      PrimeVue.changeTheme(lightTheme, darkTheme, 'theme-link', () => {})
    } else {
      // console.log('going light')
      // PrimeVue.changeTheme(darkTheme, lightTheme, 'theme-link', () => {})
    }
  },
  { immediate: true }
)

onMounted(() => {
  // const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
  // mode.preference = prefersDarkMode ? 'dark' : 'light'
})

const context = reactive({
  isDark,
  toggle
})
</script>

<template>
  <div class="flex">
    <!-- <AppThemeToggle v-slot="{ toggle, isDark }">
      <Icon
      :name="isDark ? 'heroicons:sun' : 'heroicons:moon'"
      class="w-6 h-6 cursor-pointer"
      @click="toggle"
      />
    </AppThemeToggle>
    -->
    <slot v-bind="context" />
  </div>
</template>
