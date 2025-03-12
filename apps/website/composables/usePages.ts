import { ref } from 'vue'

export interface PageType {
  id: string
  label: string
  slug: string
  icon: string
  children?: PageType[]
  isExpanded?: boolean
}

export interface NavigationCategory {
  id: string
  label: string
  items: PageType[]
}

export interface BreadcrumbLink {
  to: string
  label: string
  ariaLabel: string
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const navigationCategories = ref([
  {
    id: 'main',
    label: 'Main',
    items: [
      {
        id: '1',
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
        id: '2',
        label: 'Feed',
        slug: '/news',
        icon: 'mdi:newspaper-variant-outline',
      },
      // {
      //   id: 'my-feeds',
      //   label: 'My Feeds',
      //   slug: '#',
      //   icon: 'mdi:rss',
      //   isExpanded: false,
      //   children: [
      //     {
      //       id: '3',
      //       label: '+ Create Feed',
      //       slug: '/feed/add',
      //       icon: 'mdi:plus',
      //     },
      //   ],
      // },
    ],
  },
  {
    id: 'profile',
    label: 'Profile',
    items: [
      {
        id: '4',
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
  const route = useRoute()

  const getFeedName = (feedId: string): string => {
    // Return empty string if it's a UUID
    if (UUID_REGEX.test(feedId)) {
      const newsCategory = navigationCategories.value.find((cat) => cat.id === 'news')
      const myFeeds = newsCategory?.items.find((item) => item.id === 'my-feeds')
      const feed = myFeeds?.children?.find((feed) => feed.id === feedId)
      return feed?.label || ''
    }
    return feedId
  }

  const generateBreadcrumbs = (path: string): BreadcrumbLink[] => {
    const pathParts = path.split('/').filter(Boolean)
    let currentPath = ''

    return pathParts
      .map((part): BreadcrumbLink | null => {
        currentPath += `/${part}`

        // Skip home link
        if (currentPath === '/' || (UUID_REGEX.test(part) && !getFeedName(part))) {
          return null
        }

        // Handle feeds
        if (currentPath.startsWith('/feed/')) {
          if (part === 'feed') {
            return {
              to: currentPath,
              label: 'Feeds',
              ariaLabel: 'Feeds',
            }
          }
          return {
            to: currentPath,
            label: getFeedName(part),
            ariaLabel: getFeedName(part),
          }
        }

        // Default handling
        return {
          to: currentPath,
          label: part.charAt(0).toUpperCase() + part.slice(1),
          ariaLabel: part.charAt(0).toUpperCase() + part.slice(1),
        }
      })
      .filter(Boolean) as BreadcrumbLink[]
  }

  const breadcrumbs = computed(() => generateBreadcrumbs(route.path))

  const currentFeedName = computed(() => {
    if (route.path.startsWith('/feed/')) {
      const feedId = route.params.feed as string
      return getFeedName(feedId)
    }
    return ''
  })

  // Existing feed management functions
  const addFeed = (id: string, label: string) => {
    const newsCategory = navigationCategories.value.find((cat) => cat.id === 'news')
    const myFeeds = newsCategory?.items.find((item) => item.id === 'my-feeds')

    if (myFeeds && !myFeeds.children.some((feed) => feed.id === id)) {
      myFeeds.children.splice(1, 0, {
        id,
        label,
        slug: `/feed/${id}`,
        icon: 'mdi:newspaper-variant-multiple-outline',
      })
    }
  }

  const initializeFeeds = () => {
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

          const newsCategory = navigationCategories.value.find((cat) => cat.id === 'news')
          const myFeeds = newsCategory?.items.find((item) => item.id === 'my-feeds')

          if (myFeeds) {
            myFeeds.children = [myFeeds.children[0]]
            data.forEach((feed) => {
              if (!myFeeds.children.some((item) => item.id === feed.id)) {
                myFeeds.children.push({
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
  }

  const deleteFeed = (feedId: string) => {
    const newsCategory = navigationCategories.value.find((cat) => cat.id === 'news')
    const myFeeds = newsCategory?.items.find((item) => item.id === 'my-feeds')

    if (myFeeds) {
      const index = myFeeds.children.findIndex((item) => item.id === feedId)
      if (index > -1) {
        myFeeds.children.splice(index, 1)
      }
    }
  }

  onMounted(initializeFeeds)

  return {
    appLinks: navigationCategories,
    breadcrumbs,
    currentFeedName,
    addFeed,
    deleteFeed,
  }
}
