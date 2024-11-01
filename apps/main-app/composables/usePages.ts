import { ref } from 'vue'

export interface PageType {
  id: number
  label: string
  slug: string
  icon: string
  children?: PageType[]
}

export interface NavigationCategory {
  id: string
  label: string
  items: PageType[]
}

const navigationCategories = ref([
  {
    id: 'main',
    label: 'Main',
    items: [
      {
        id: 1,
        label: 'Home',
        slug: '/',
        icon: 'material-symbols:home-rounded',
      },
    ],
  },
  {
    id: 'news',
    label: 'News',
    items: [
      {
        id: 2,
        label: 'Feed',
        slug: '/news',
        icon: 'mdi:newspaper-variant-outline',
      },
      {
        id: 3,
        label: '+ Create Feed',
        slug: '/feed/add',
        icon: 'mdi:plus',
      },
    ],
  },
  {
    id: 'profile',
    label: 'Profile',
    items: [
      {
        id: 4,
        label: 'Upvoted',
        slug: '/profile/votes/upvoted',
        icon: 'mdi:arrow-up-bold',
      },
      {
        id: 5,
        label: 'Downvoted',
        slug: '/profile/votes/downvoted',
        icon: 'mdi:arrow-down-bold',
      },
      {
        id: 6,
        label: 'Bookmarks',
        slug: '/profile/bookmarks',
        icon: 'mdi:bookmark-outline',
      },
    ],
  },
] as NavigationCategory[])

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

        // Add custom feeds to the News category
        const newsCategory = navigationCategories.value.find((cat) => cat.id === 'news')
        if (newsCategory) {
          data.forEach((feed) => {
            if (!newsCategory.items.some((item) => item.id === feed.id)) {
              newsCategory.items.push({
                id: feed.id,
                label: feed.name,
                slug: `/feed/${feed.id}`,
                icon: 'mdi:newspaper-variant-multiple-outline',
              })
            }
          })
        }
      })
  }

  return {
    appLinks: navigationCategories,
  }
}
