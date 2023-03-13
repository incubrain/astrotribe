import * as z from 'zod'

export const Role = z.object({
    id: z.number(),
    title: z.string().nullable(),
    body: z.string().nullable().optional(),
    created_at: z.string().optional(),
})

export const Skill = z.object({
    id: z.number(),
    title: z.string().nullable(),
    body: z.string().nullable().optional(),
    created_at: z.string().optional(),
})

export const Language = z.object({
    id: z.number(),
    name: z.string(),
    iso_639_1: z.string().optional(),
    iso_639_2: z.string().optional(),
})

export const Location = z.object({
    id: z.number(),
    created_at: z.string().optional(),
    city: z.string(),
    country: z.string(),
    state: z.string(),
    address: z.string().nullable(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
})

export const UserLocation = z.object({
    id: z.number(),
    created_at: z.string(),
    city: z.string(),
    country: z.string(),
    state: z.string(),
    address: z.string().nullable(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    is_home: z.boolean(),
})

export const Socials = z.object({
    id: z.number(),
    url: z.string(),
    platform: z.string(),
    username: z.string().nullable(),
})

export const Post = z.object({
    id: z.number(),
    created_at: z.string().nullable(),
    user_id: z.string().nullable(),
    title: z.string().nullable(),
    body: z.string().nullable(),
    image: z.string().nullable(),
    status_id: z.number(),
})

export const News = z.object({
    title: z.string().nullable(),
    body: z.string().nullable(),
    author: z.string().nullable(),
    published: z.string().nullable(),
    category: z.string().nullable(),
})

export const UserFull = z.object({
    id: z.number(),
    email: z.string(),
    given_name: z.string(),
    surname: z.string().nullable(),
    username: z.string().nullable(),
    dob: z.string().nullable(),
    gender_id: z.number().nullable(),
    created_at: z.string(),
    updated_at: z.string().nullable(),
    last_seen: z.string(),
    avatar: z.string().nullable(),
    cover_image: z.string().nullable(),
    introduction: z.string().nullable(),
    quote: z.string().nullable(),
    user_roles: z.array(Role),
    follow_count: z.number().nullable(),
    followed_count: z.number().nullable(),
    user_skills: z.array(Skill).nullable(),
    user_locations: z.array(UserLocation).nullable(),
    user_languages: z.array(Language).nullable(),
    user_socials: z.array(Socials).nullable(),
    main_role: z.object({
        role: z.string(),
        icon: z.string(),
    }),
})

export const User = z.object({
    id: z.number(),
    given_name: z.string(),
    surname: z.string().nullable(),
    username: z.string().nullable(),
    avatar: z.string().nullable(),
    introduction: z.string().nullable(),
    follow_count: z.number().nullable(),
    followed_count: z.number().nullable(),
    is_following: z.boolean().nullable(),
    main_role: z.object({
        role: z.string(),
        icon: z.string(),
    }),
    user_roles: z.array(
        z.object({
            id: z.number(),
            title: z.string(),
        })
    ),
    last_seen: z.string(),
})

export const ATEvent = z.object({
    id: z.number(),
    title: z.string().nullable(),
    body: z.string().nullable(),
    date: z.string(),
    event_hosts: z.array(
        z.object({
            id: z.number(),
            given_name: z.string(),
        })
    ),
    venues: z.object({
        id: z.number(),
        name: z.string(),
        location: z.object({
            city: z.string(),
            country: z.string(),
            state_province: z.string(),
        }),
    }),
})

export const Venue = z.object({
    id: z.number(),
    venue_id: z.number(),
    title: z.string().nullable(),
    body: z.string().nullable(),
    created_at: z.string(),
    date: z.string(),
    location: z.object({
        city: z.string(),
        country: z.string(),
        state_province: z.string(),
    }),
})

export const UserRoles = z.array(Role)
