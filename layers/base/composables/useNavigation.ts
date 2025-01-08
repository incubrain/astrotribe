// composables/useNavigation.ts
export const useNavigation = () => {
  const isSidebarOpen = useState('nav-sidebar-open', () => true)
  const isMobileSidebarOpen = useState('nav-mobile-sidebar-open', () => false)
  const isMobile = useMediaQuery('(max-width: 768px)')

  const toggleSidebar = (value?: boolean) => {
    isSidebarOpen.value = value ?? !isSidebarOpen.value
  }

  const toggleMobileSidebar = (value?: boolean) => {
    isMobileSidebarOpen.value = value ?? !isMobileSidebarOpen.value
  }

  const closeMobileSidebar = () => {
    isMobileSidebarOpen.value = false
  }

  // Watch route changes
  const route = useRoute()
  watch(
    () => route.path,
    () => {
      if (isMobile.value) {
        closeMobileSidebar()
      }
    },
  )

  return {
    isSidebarOpen,
    isMobileSidebarOpen,
    isMobile,
    toggleSidebar,
    toggleMobileSidebar,
    closeMobileSidebar,
  }
}
