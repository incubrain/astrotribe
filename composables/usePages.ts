import { ref, computed } from 'vue'
import { Page } from '@/types'

const pages = ref([
  // {
  //     id: 0,
  //     name: 'News',
  //     slug: '/news',
  //     icon: 'bi:newspaper',
  //     children: [
  //         { id: 1, name: 'Newsfeed', slug: '/', icon: 'bi:newspaper' },
  //         { id: 2, name: 'Discover', slug: '/discover', icon: 'ri:compass-discover-line' },
  //     ],
  // },
  {
    id: 1,
    name: 'Events',
    slug: '/events',
    icon: 'i-material-symbols-event',
    children: [
      { id: 10, name: 'Upcoming', slug: '/', icon: 'i-material-symbols-event' }
      // { id: 11, name: 'Popular', slug: '/popular', icon: 'ph:fire-simple-bold' },
    ]
  },
  {
    id: 2,
    name: 'Users',
    slug: '/users',
    icon: 'fa-solid:user-astronaut',
    children: [
      { id: 20, name: 'All', slug: '/', icon: 'fa-solid:user-astronaut' }
      // { id: 21, name: 'In Orbit', slug: '/in-orbit', icon: 'ri:compass-discover-line' },
    ]
  },
  {
    id: 3,
    name: 'Venues',
    slug: '/venues',
    icon: 'i-material-symbols-location-on-rounded'
    // children: [
    //     { id: 20, name: 'All', slug: '/', icon: 'tabler:building-church' },
    //     { id: 21, name: 'In Orbit', slug: '/in-orbit', icon: 'tabler:building-church' },
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
