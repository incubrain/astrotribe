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

// Event Types
export type Venue = z.infer<typeof schema.Venue>
export type ATEvent = z.infer<typeof schema.ATEvent>
