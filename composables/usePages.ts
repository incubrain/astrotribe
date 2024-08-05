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

const adminLinks = ref([
  {
    id: 0,
    label: 'App',
    slug: '/astrotribe',
    icon: 'mdi:application'
  },
  {
    id: 1,
    label: 'Dashboard',
    slug: '/astrotribe/admin',
    icon: 'mdi:view-dashboard',
    children: []
  },
  {
    id: 2,
    label: 'Users',
    slug: '/astrotribe/admin/users',
    icon: 'mdi:account',
    children: []
  },
  {
    id: 3,
    label: 'Upload',
    slug: '/astrotribe/admin/upload',
    icon: 'mdi:upload',
    children: []
  },

  {
    id: 3,
    label: 'Research',
    slug: '/astrotribe/admin/research',
    icon: 'mdi:card-text',
    children: []
  },
  {
    id: 4,
    label: 'Analytics',
    slug: '/astrotribe/admin/analytics',
    icon: 'mdi:chart-bar',
    children: []
  },
  {
    id: 5,
    label: 'Socials',
    slug: '/astrotribe/admin/socials',
    icon: 'mdi:chart-bar',
    children: []
  },
  {
    id: 6,
    label: 'Chat',
    slug: '/astrotribe/admin/chat',
    icon: 'mdi:chat',
    children: []
  },
  {
    id: 7,
    label: 'BP',
    slug: '/astrotribe/admin/business-plan',
    icon: 'mdi:chat',
    children: []
  },
  {
    id: 8,
    label: 'Systems',
    slug: '/astrotribe/admin/business-systems',
    icon: 'mdi:chat',
    children: [
      {
        id: 71,
        label: 'Users',
        slug: '/astrotribe/admin/business-systems/users',
        icon: 'mdi:account',
        children: []
      },
      {
        id: 72,
        label: 'Companies',
        slug: '/astrotribe/admin/business-systems/companies',
        icon: 'mdi:account',
        children: []
      },
      {
        id: 73,
        label: 'Events',
        slug: '/astrotribe/admin/business-systems/events',
        icon: 'mdi:account',
        children: []
      },
      {
        id: 74,
        label: 'Content',
        slug: '/astrotribe/admin/business-systems/content',
        icon: 'mdi:account',
        children: []
      }
    ]
  },
  {
    id: 8,
    label: 'Financials',
    slug: '/astrotribe/admin/financials',
    icon: 'material-symbols:attach-money',
    children: []
  },
  {
    id: 9,
    label: 'Scraper',
    slug: '/astrotribe/admin/scraper',
    icon: 'mdi:spider',
    children: []
  }
])

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

// Events -
// Under these we display our star gazing programs that we have done along with locations and a page to book us for future star gazing events.

// Our projects -
// This section should display all our projects
// Astrotribe 2022
// Astro tribe 2023
// Dst + conference 2023

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
    key: 'projects',
    label: 'Projects',
    icon: 'material-symbols:work',
    visible: true,
    disabled: false,
    items: [
      {
        key: 'astrotribe',
        label: 'Astrotribe',
        icon: 'material-symbols:groups',
        url: 'projects/astrotribe',
        visible: true,
        disabled: false
      },
      {
        key: 'dark-sky-conference-2023',
        label: 'Dark Sky Conference',
        icon: 'material-symbols:mic-rounded',
        url: 'projects/dark-sky-conference-2023',
        visible: true,
        disabled: false
      }
    ]
  },
  {
    key: 'events',
    label: 'Events',
    icon: 'material-symbols:event',
    visible: false,
    disabled: false,
    items: [
      {
        key: 'stargazing',
        label: 'Stargazing',
        icon: 'material-symbols:dark-mode',
        url: 'events/stargazing',
        visible: false,
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
      },
      {
        key: 'blog-dark-sky-conservation',
        label: 'Dark Sky Conservation',
        icon: 'material-symbols:menu-book-outline',
        url: '/blog/dark-sky-conservation',
        visible: true,
        disabled: false
      },
      {
        key: 'blog-people-of-space',
        label: 'Peoples of Space',
        icon: 'material-symbols:menu-book-outline',
        url: '/blog/people-of-space',
        visible: true,
        disabled: false
      },
      {
        key: 'blog-space-exploration',
        label: 'Space Exploration',
        icon: 'material-symbols:menu-book-outline',
        url: '/blog/space-exploration',
        visible: true,
        disabled: false
      },
      {
        key: 'blog-sustainable-development',
        label: 'Sustainable Development',
        icon: 'material-symbols:menu-book-outline',
        url: '/blog/sustainable-development',
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
    adminLinks,
    socials,
    tabs: (currentPage: string) =>
      appLinks.value.find((page: PageType) => page.label.toLocaleLowerCase() === currentPage)
  }
}
