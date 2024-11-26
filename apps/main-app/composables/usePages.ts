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
      {
        id: 'my-feeds',
        label: 'My Feeds',
        slug: '#',
        icon: 'mdi:rss',
        isExpanded: false,
        children: [
          {
            id: '3',
            label: '+ Create Feed',
            slug: '/feed/add',
            icon: 'mdi:plus',
          },
        ],
      },
    ],
  },
  {
    id: 'profile',
    label: 'Profile',
    items: [
      {
        id: '4',
        label: 'Upvoted',
        slug: '/profile/votes/upvoted',
        icon: 'mdi:arrow-up-bold',
      },
      {
        id: '5',
        label: 'Downvoted',
        slug: '/profile/votes/downvoted',
        icon: 'mdi:arrow-down-bold',
      },
      {
        id: '6',
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

  const addFeed = (id: string, label: string) => {
    const newsCategory = navigationCategories.value.find((cat) => cat.id === 'news')
    const myFeeds = newsCategory.items.find((item) => item.id === 'my-feeds')

    if (myFeeds && !myFeeds.children.some((feed) => feed.id === id)) {
      // Insert new feed after the Create Feed option
      myFeeds.children.splice(1, 0, {
        id,
        label,
        slug: `/feed/${id}`,
        icon: 'mdi:newspaper-variant-multiple-outline',
      })
    }
  }

  // Update the initializeFeeds function to maintain Create Feed at the top
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
            // Keep only the Create Feed option
            myFeeds.children = [myFeeds.children[0]]

            // Add custom feeds after Create Feed
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
    const myFeeds = newsCategory.items.find((item) => item.id === 'my-feeds')

    if (myFeeds) {
      const index = myFeeds.children.findIndex((item) => item.id === feedId)
      if (index > -1) {
        myFeeds.children.splice(index, 1)
      }
    }
  }

  const toggleFeedExpansion = (feedId: string) => {
    const newsCategory = navigationCategories.value.find((cat) => cat.id === 'news')
    const myFeeds = newsCategory?.items.find((item) => item.id === feedId)
    if (myFeeds) {
      myFeeds.isExpanded = !myFeeds.isExpanded
    }
  }

  onMounted(initializeFeeds)

  return {
    appLinks: navigationCategories,
    addFeed,
    deleteFeed,
    toggleFeedExpansion,
  }
}
