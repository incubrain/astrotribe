import { useRoute } from 'vue-router'
import { computed } from 'vue'

interface BreadcrumbItem {
    label: string
    to: string
    current: boolean
}

export const useBreadcrumbs = () => {
  const route = useRoute()

  // You can hardcode or dynamically map route paths to breadcrumb items
  const breadcrumbs = computed(() => {
    const pathParts = route.path.split('/').filter(Boolean)
    const breadcrumbItems = [] as BreadcrumbItem[]

    pathParts.forEach((part, index) => {
      const to = '/' + pathParts.slice(0, index + 1).join('/')
      breadcrumbItems.push({
        label: decodeURIComponent(part.charAt(0).toUpperCase() + part.slice(1)),
        to,
        current: index === pathParts.length - 1,
      })
    })

    return breadcrumbItems
  })

  return { breadcrumbs }
}
