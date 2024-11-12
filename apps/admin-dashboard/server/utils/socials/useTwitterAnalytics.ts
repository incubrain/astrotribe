import { useServerError } from '@ib/logger'

// user tweet timeline
// https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/api-reference/get-users-id-tweets

// mentions timeline
// https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/api-reference/get-users-id-mentions

// api reference
// https://github.com/xdevplatform/twitter-api-typescript-sdk

// LINKEDIN

// MANAGE ACCOUNTS
// https://github.com/linkedin-developers/linkedin-api-js-client

// NON OFFICIAL API: https://github.com/tomquirk/linkedin-api

const TWITTER_API_URL = 'https://api.twitter.com/2/tweets'
const BEARER_TOKEN = 'YOUR_TWITTER_BEARER_TOKEN'

export function useTwitterAnalytics(postId: string) {
  const errors = useServerError('getTwitterPostAnalytics')

  //
  async function fetchPostAnalytics() {
    const url = `${TWITTER_API_URL}/${postId}?tweet.fields=non_public_metrics,organic_metrics&expansions=attachments.media_keys&media.fields=non_public_metrics,organic_metrics`
    const response = await $fetch(url, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    })
    const data = errors.handleFetchError({
      response,
      devMessage: `Failed to fetch post analytics for ${postId}`,
      userMessage: `Failed to fetch analytics for post ${postId}`,
    })
    return {
      impression_count: data.data.non_public_metrics.impression_count,
      like_count: data.data.organic_metrics.like_count,
      reply_count: data.data.organic_metrics.reply_count,
      retweet_count: data.data.organic_metrics.retweet_count,
      quote_count: data.data.public_metrics.quote_count,
      url_link_clicks: data.data.non_public_metrics.url_link_clicks,
      user_profile_clicks: data.data.non_public_metrics.user_profile_clicks,
      media: data.includes.media,
    }
  }

  async function fetchUserProfile(userId: string) {
    const url = `${TWITTER_API_URL}/users/${userId}?user.fields=created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,url,username,verified,withheld&expansions=pinned_tweet_id`
    const response = await $fetch(url, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    })
    const data = errors.handleFetchError({
      response,
      devMessage: `Failed to fetch user profile for ${userId}`,
      userMessage: `Failed to fetch profile for user ${userId}`,
    })
    return {
      id: data.data.id,
      name: data.data.name,
      username: data.data.username,
      created_at: data.data.created_at,
      description: data.data.description,
      entities: data.data.entities,
      location: data.data.location,
      pinned_tweet_id: data.data.pinned_tweet_id,
      profile_image_url: data.data.profile_image_url,
      protected: data.data.protected,
      url: data.data.url,
      verified: data.data.verified,
      withheld: data.data.withheld,
      pinned_tweet: data.includes.tweets ? data.includes.tweets[0] : null,
    }
  }

  return {
    fetchPostAnalytics,
    fetchUserProfile,
  }
}
