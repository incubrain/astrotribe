import { ref } from 'vue'
import type { PageType } from '@/types/pages'

const appLinks = ref([
  {
    id: 1,
    label: 'Home',
    slug: '/astrotribe/',
    icon: 'material-symbols:home-rounded',
    children: [
      // { id: 11, label: 'Discover', slug: '/discover', icon: 'ri:compass-discover-line' }
    ]
  },
  {
    id: 2,
    label: 'Users',
    slug: '/astrotribe/users',
    icon: 'material-symbols:account-circle',
    children: [
      // { id: 21, label: 'In Orbit', slug: '/astrotribe/in-orbit', icon: 'ri:compass-discover-line' },
    ]
  },
  {
    id: 3,
    label: 'Companies',
    slug: '/astrotribe/companies',
    icon: 'material-symbols:location-on-rounded'
    // children: [
    //     { id: 41, label: 'In Orbit', slug: '/astrotribe/in-orbit', icon: 'tabler:building-church' },
    // ],
  },
  // {
  //   id: 3,
  //   label: 'Events',
  //   slug: '/astrotribe/events',
  //   icon: 'material-symbols:event',
  //   children: [
  //     // { id: 31, label: 'Popular', slug: '/astrotribe/popular', icon: 'ph:fire-simple-bold' },
  //   ]
  // },
  // {
  //   id: 4,
  //   label: 'Venues',
  //   slug: '/astrotribe/venues',
  //   icon: 'material-symbols:location-on-rounded'
  //   children: [
  //       { id: 41, label: 'In Orbit', slug: '/astrotribe/in-orbit', icon: 'tabler:building-church' },
  //   ],
  // },
  {
    id: 5,
    label: 'News',
    slug: '/astrotribe/news',
    icon: 'mdi:newspaper-variant-outline'
  },
  {
    id: 6,
    label: 'Q&A',
    slug: '/astrotribe/ask',
    icon: 'mdi:information-slab-box'
  }
  // {
  //   id: 6,
  //   label: 'Research',
  //   slug: '/astrotribe/research',
  //   icon: 'mdi:library-books'
  // }
  // {
  //   id: 5,
  //   label: 'Serp',
  //   slug: '/astrotribe/serp',
  //   icon: 'mdi:newspaper-variant-outline'
  // }
] as PageType[])

const socials = ref([
  {
    id: 1,
    platform: 'twitter',
    icon: 'mdi:twitter',
    url: 'https://twitter.com/AstronEra',
    username: 'uk'
  },
  {
    id: 2,
    icon: 'mdi:linkedin',
    platform: 'linkedin',
    url: 'https://www.linkedin.com/in/shweta-kulkarni-1b1b1b1b',
    username: 'uk'
  },
  {
    id: 3,
    icon: 'mdi:instagram',
    platform: 'instagram',
    url: 'https://www.instagram.com/astronera',
    username: 'uk'
  }
])

const websiteLinks = [
  {
    key: 'about-us',
    label: 'About Us',
    icon: 'material-symbols:info',
    visible: true,
    disabled: false,
    items: [
      {
        key: 'about',
        label: 'About',
        icon: 'material-symbols:info',
        url: '/about',
        visible: true,
        disabled: false
      },
      {
        key: 'team',
        label: 'Team',
        icon: 'material-symbols:emoji-people',
        url: '/team',
        visible: true,
        disabled: false
      },
      {
        key: 'contact',
        label: 'Contact',
        icon: 'material-symbols:call',
        url: '/contact',
        visible: true,
        disabled: false
      }
    ]
  },
  {
    key: 'events',
    label: 'Events',
    icon: 'material-symbols:event',
    visible: true,
    disabled: false,
    items: [
      {
        key: 'conference',
        label: 'Conference',
        icon: 'material-symbols:emoji-people',
        url: '/conference',
        visible: true,
        disabled: false
      }
    ]
  },
  {
    key: 'blog',
    label: 'Blog',
    icon: 'material-symbols:menu-book-outline',
    visible: true,
    disabled: false,
    items: [
      {
        key: 'blog-home',
        label: 'All',
        icon: 'material-symbols:menu-book-outline',
        url: '/blog',
        visible: true,
        disabled: false
      }
    ]
  }
]

export default function usePages() {
  return {
    websiteLinks,
    appLinks,
    socials,
    tabs: (currentPage: string) =>
      appLinks.value.find((page: PageType) => page.label.toLocaleLowerCase() === currentPage)
  }
}
