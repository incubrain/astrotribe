import { ref, computed } from 'vue'
import { Page } from '@/types'

const pages = ref([
  // {
  //     id: 0,
  //     name: 'News',
  //     slug: '/news',
  //     icon: 'bi:newspaper',
  //     children: [
  //         { id: 2, name: 'Discover', slug: '/discover', icon: 'ri:compass-discover-line' },
  //     ],
  // },
  {
    id: 1,
    name: 'Events',
    slug: '/astrotribe/events',
    icon: 'i-material-symbols-event',
    children: [
      // { id: 11, name: 'Popular', slug: '/astrotribe/popular', icon: 'ph:fire-simple-bold' },
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
    name: 'Venues',
    slug: '/astrotribe/venues',
    icon: 'i-material-symbols-location-on-rounded'
    // children: [
    //     { id: 21, name: 'In Orbit', slug: '/astrotribe/in-orbit', icon: 'tabler:building-church' },
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
