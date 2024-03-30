<script setup>
import { usePrimeVue } from 'primevue/config'
const mode = useColorMode()

const PrimeVue = usePrimeVue()
const isDark = computed(() => mode.preference === 'dark')

const toggle = () => {
  mode.preference = isDark.value ? 'light' : 'dark'
  console.log('toggle', window.matchMedia('(prefers-color-scheme: dark)'))
}

watch(isDark, (isNowDark) => {
  console.log('isDark', isNowDark)
  const lightTheme = 'aura-light-teal'
  const darkTheme = 'aura-dark-teal'
  let currentTheme = lightTheme
  let newTheme = darkTheme
  if (isNowDark) {
    console.log('going dark')
    PrimeVue.changeTheme(currentTheme, newTheme, 'theme-link', () => {})
  } else {
    console.log('going light')
    currentTheme = darkTheme
    newTheme = lightTheme
    PrimeVue.changeTheme(currentTheme, newTheme, 'theme-link', () => {})
  }
})

onMounted(() => {
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
  mode.preference = prefersDarkMode ? 'dark' : 'light'
})

const context = reactive({
  isDark,
  toggle
})
</script>

<template>
  <div class="flex">
    <slot v-bind="context" />
  </div>
</template>
