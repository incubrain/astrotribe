import { ref, computed } from 'vue'
import { Page } from '@/types/pages'

const pages = ref([
  {
    id: 1,
    name: 'Home',
    slug: '/astrotribe/',
    icon: 'i-material-symbols-home-rounded',
    children: [
      // { id: 11, name: 'Discover', slug: '/discover', icon: 'ri:compass-discover-line' }
    ]
  },
  {
    id: 2,
    name: 'Users',
    slug: '/astrotribe/users',
    icon: 'i-material-symbols-account-circle',
    children: [
      // { id: 21, name: 'In Orbit', slug: '/astrotribe/in-orbit', icon: 'ri:compass-discover-line' },
    ]
  },
  {
    id: 3,
    name: 'Events',
    slug: '/astrotribe/events',
    icon: 'i-material-symbols-event',
    children: [
      // { id: 31, name: 'Popular', slug: '/astrotribe/popular', icon: 'ph:fire-simple-bold' },
    ]
  },
  {
    id: 4,
    name: 'Venues',
    slug: '/astrotribe/venues',
    icon: 'i-material-symbols-location-on-rounded'
    // children: [
    //     { id: 41, name: 'In Orbit', slug: '/astrotribe/in-orbit', icon: 'tabler:building-church' },
    // ],
  },
  {
    id: 5,
    name: 'News',
    slug: '/astrotribe/news',
    icon: 'i-mdi-newspaper-variant-outline'
    // children: [
    //     { id: 51, name: 'In Orbit', slug: '/astrotribe/in-orbit', icon: 'tabler:building-church' },
    // ],
  }
] as Page[])

export default function usePages() {
  return {
    pages: computed(() => pages.value),
    tabs: (currentPage: string) =>
      pages.value.find((p: Page) => p.name.toLocaleLowerCase() === currentPage)
  }
}
