import { ref } from 'vue'
import type { PageType } from '@/types/pages'

const appLinks = ref([
  {
    id: 1,
    label: 'Home',
    slug: '/',
    icon: 'material-symbols:home-rounded',
    children: [
      // { id: 11, label: 'Discover', slug: '/discover', icon: 'ri:compass-discover-line' }
    ],
  },
  {
    id: 2,
    label: 'News',
    slug: '/news',
    icon: 'mdi:newspaper-variant-outline',
  },
  {
    id: 3,
    label: 'Add Custom Feed',
    slug: '/feed/add',
    icon: 'mdi:plus',
  },
  // {
  //   id: 3,
  //   label: 'Companies',
  //   slug: '/companies',
  //   icon: 'material-symbols:location-on-rounded',
  // },
  // {
  //   id: 4,
  //   label: 'Q&A',
  //   slug: '/ask',
  //   icon: 'mdi:information-slab-box',
  // },
] as PageType[])

export default function usePages() {
  const client = useSupabaseClient()

  const { profile } = useCurrentUser()
  if (profile.id) {
    const toast = useNotification()
    client
      .from('feeds')
      .select('id, name')
      .eq('user_id', profile.id)
      .then(({ data, error }) => {
        if (error) {
          toast.error({
            summary: 'Failed to get custom feeds',
            message: 'Could not get custom feeds',
          })

          return
        }

        data.forEach((feed) => {
          if (!appLinks.value.some((link) => link.id === feed.id)) {
            appLinks.value.push({
              id: feed.id,
              label: feed.name,
              slug: `/feed/${feed.id}`,
              icon: 'mdi:newspaper-variant-multiple-outline',
            })
          }
        })
      })
  }

  return {
    appLinks,
  }
}
