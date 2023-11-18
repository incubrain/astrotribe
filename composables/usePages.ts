import { ref } from 'vue'
import type { PageType } from '@/types/pages'

const pages = ref([
  {
    id: 1,
    label: 'Home',
    slug: '/astrotribe/',
    icon: 'i-material-symbols-home-rounded',
    children: [
      // { id: 11, label: 'Discover', slug: '/discover', icon: 'ri:compass-discover-line' }
    ]
  },
  {
    id: 2,
    label: 'Users',
    slug: '/astrotribe/users',
    icon: 'i-material-symbols-account-circle',
    children: [
      // { id: 21, label: 'In Orbit', slug: '/astrotribe/in-orbit', icon: 'ri:compass-discover-line' },
    ]
  },
  {
    id: 3,
    label: 'Events',
    slug: '/astrotribe/events',
    icon: 'i-material-symbols-event',
    children: [
      // { id: 31, label: 'Popular', slug: '/astrotribe/popular', icon: 'ph:fire-simple-bold' },
    ]
  },
  {
    id: 4,
    label: 'Venues',
    slug: '/astrotribe/venues',
    icon: 'i-material-symbols-location-on-rounded'
    // children: [
    //     { id: 41, label: 'In Orbit', slug: '/astrotribe/in-orbit', icon: 'tabler:building-church' },
    // ],
  }
  // {
  //   id: 5,
  //   label: 'News',
  //   slug: '/astrotribe/news',
  //   icon: 'i-mdi-newspaper-variant-outline'
  // }
  // {
  //   id: 5,
  //   label: 'Serp',
  //   slug: '/astrotribe/serp',
  //   icon: 'i-mdi-newspaper-variant-outline'
  // }
] as PageType[])

const socials = ref([
  {
    id: 1,
    platform: 'twitter',
    icon: 'i-mdi-twitter',
    url: 'https://twitter.com/AstronEra',
    username: 'uk'
  },
  {
    id: 2,
    icon: 'i-mdi-linkedin',
    platform: 'linkedin',
    url: 'https://www.linkedin.com/in/shweta-kulkarni-1b1b1b1b',
    username: 'uk'
  },
  {
    id: 3,
    icon: 'i-mdi-instagram',
    platform: 'instagram',
    url: 'https://www.instagram.com/astronera',
    username: 'uk'
  }
])

export default function usePages() {
  return {
    pages,
    socials,
    tabs: (currentPage: string) =>
      pages.value.find((p: PageType) => p.label.toLocaleLowerCase() === currentPage)
  }
}
