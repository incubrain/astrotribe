// composables/useFeedNavigation.ts
export const useFeedNavigation = () => {
  const feedName = useState<string>('currentFeedName', () => '')
  const { appLinks } = usePages()

  const getFeedName = (feedId: string): string => {
    const newsCategory = appLinks.value.find((cat) => cat.id === 'news')
    const myFeeds = newsCategory?.items.find((item) => item.id === 'my-feeds')
    const feed = myFeeds?.children?.find((feed) => feed.id === feedId)
    return feed?.label || feedId
  }

  const setCurrentFeedName = (feedId: string) => {
    feedName.value = getFeedName(feedId)
  }

  return {
    feedName: readonly(feedName),
    setCurrentFeedName,
  }
}
