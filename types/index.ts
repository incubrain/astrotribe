import * as z from 'zod'
import * as schema from './zod'

// Generic Types
export type Page = z.infer<typeof schema.PageWithChildren>
export type Role = z.infer<typeof schema.Role>
export type Skill = z.infer<typeof schema.Skill>
export type Socials = z.infer<typeof schema.Socials>
export type Language = z.infer<typeof schema.Language>
export type Location = z.infer<typeof schema.Location>

// User Types
export type User = z.infer<typeof schema.User>
export type UserFull = z.infer<typeof schema.UserFull>
export type UserRoles = z.infer<typeof schema.UserRoles>
export type UserLocation = z.infer<typeof schema.UserLocation>
export type Follower = z.infer<typeof schema.Follower>

// Post Types
export type Post = z.infer<typeof schema.Post>
export type News = z.infer<typeof schema.News>

// Venue Types
export type VenueFull = z.infer<typeof schema.VenueFull>
export type VenueBasic = z.infer<typeof schema.VenueBasic>

// Event Types
export type EventFull = z.infer<typeof schema.EventFull>
export type EventBasic = z.infer<typeof schema.EventBasic>
