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
    ],
  },
  {
    id: 2,
    label: 'News',
    slug: '/astrotribe/news',
    icon: 'mdi:newspaper-variant-outline',
  },
  {
    id: 3,
    label: 'Companies',
    slug: '/astrotribe/companies',
    icon: 'material-symbols:location-on-rounded',
  },
  {
    id: 4,
    label: 'Q&A',
    slug: '/astrotribe/ask',
    icon: 'mdi:information-slab-box',
  },
] as PageType[])



export default function usePages() {
  return {
    appLinks,
  }
}
