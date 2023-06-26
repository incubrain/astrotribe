import * as user from './supabase/get/users'
import * as events from './supabase/get/events'
import * as venues from './supabase/get/venues'
import * as posts from './supabase/get/posts'
import { publicImageURL } from './supabase/get/publicImageURL'

export default function useData() {
  return {
    posts: {
      many: posts.postsMany
      // byCategory: postsByCategory,
    },
    images: {
      avatar: publicImageURL,
      cover: publicImageURL
    },
    users: {
      single: user.userSingle,
      many: user.UsersMany,
      // byRole: userByRole,
      // connections: UserConnections,
      followers: user.userFollowers,
      followed: user.userFollowed
    },
    events: {
      many: events.eventsMany,
      single: events.getSingleEvent
      // byHost: eventsByHost,
    },
    venues: {
      many: venues.venuesMany,
      single: venues.venueSingle
    }
  }
}
