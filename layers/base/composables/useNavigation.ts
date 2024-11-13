// composables/useNavigation.ts
export const useNavigation = () => {
  const isSidebarOpen = useState('nav-sidebar-open', () => true)
  const isMobileSidebarOpen = useState('nav-mobile-sidebar-open', () => false)

  // Create our own media query composable
  const isMobile = useMediaQuery('(max-width: 768px)')

  // Close mobile nav on route changes
  const route = useRoute()
  
  watch(
    () => route.path,
    () => {
      isMobileSidebarOpen.value = false
    },
  )

  return {
    isSidebarOpen,
    isMobileSidebarOpen,
    isMobile,
  }
}
