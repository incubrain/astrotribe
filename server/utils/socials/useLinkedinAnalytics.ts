import { useServerError } from '#imports'

const LINKEDIN_API_URL = 'https://api.linkedin.com/rest/dmaOrganizationalPageContentAnalytics'
const ACCESS_TOKEN = 'YOUR_LINKEDIN_ACCESS_TOKEN'

export function useLinkedinAnalytics(postId: string) {
  const errors = useServerError('getLinkedInPageAnalytics')

  // https://learn.microsoft.com/en-us/linkedin/dma/analytics/organizational-page-content-analytics?tabs=http%2Cnon-obfuscated
  async function fetchPostAnalytics() {
    const url = `${LINKEDIN_API_URL}?q=postDimension&sourcePostEntity=${postId}&metricType=IMPRESSIONS,REPOSTS,COMMENTS,REACTIONS&dimensionType=STAFF_COUNT_RANGE&access_token=${ACCESS_TOKEN}`
    const response = await $fetch(url, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    })
    const data = errors.handleFetchError({
      response,
      devMessage: `Failed to fetch post analytics for ${postId}`,
      userMessage: `Failed to fetch analytics for post ${postId}`,
    })
    return data.elements.map((element: any) => ({
      type: element.type,
      value: element.metric.value.totalCount.long,
    }))
  }

  // Fetch trend data for the LinkedIn organizational page
  async function fetchTrendAnalytics(startDate: number, endDate: number, pageId: string) {
    const url = `${LINKEDIN_API_URL}?q=trend&sourceEntity=urn:li:organizationalPage:${pageId}&metricTypes=List(IMPRESSIONS,COMMENTS,REACTIONS,REPOSTS,ENGAGEMENT_RATE,CTR,ACQUIRED_FOLLOWS)&timeIntervals=(timeRange:(start:${startDate},end:${endDate}))`

    const response = await $fetch(url, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    })

    const data = errors.handleFetchError({
      response,
      devMessage: `Failed to fetch trend analytics for page ${pageId}`,
      userMessage: `Failed to fetch trend analytics for page ${pageId}`,
    })

    return data.elements.map((element: any) => ({
      type: element.type,
      value: element.metric.value.totalCount.long || element.metric.value.totalCount.bigDecimal,
    }))
  }

  return {
    fetchPostAnalytics,
    fetchTrendAnalytics,
  }
}
