import { userSingle, UsersMany, userById, userFollowers, userFollowed } from './supabase/get/users'
import { eventsMany, eventById } from './supabase/get/events'
import { venuesMany, venueById } from './supabase/get/venues'
import { postsMany } from './supabase/get/posts'
import { newsMany } from './supabase/get/news'
import * as image from './supabase/get/publicImage'

export default function useData() {
    return {
        posts: {
            many: postsMany,
            // byCategory: postsByCategory,
        },
        news: {
            many: newsMany,
        },
        images: {
            avatar: image.profileSingle,
            cover: image.profileSingle,
        },
        users: {
            single: userSingle,
            many: UsersMany,
            byId: userById,
            // byRole: userByRole,
            // connections: UserConnections,
            followers: userFollowers,
            followed: userFollowed,
        },
        events: {
            many: eventsMany,
            byId: eventById,
            // byHost: eventsByHost,
        },
        venues: {
            many: venuesMany,
            byId: venueById,
        },
    }
}
