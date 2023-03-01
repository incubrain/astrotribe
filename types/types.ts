import * as z from 'zod'
import * as schema from './zod'

// User Types
export type User = z.infer<typeof schema.User>;
export type Follower = z.infer<typeof schema.Follower>;
export type UserBasic = z.infer<typeof schema.UserBasic>;

// Post Types
export type Post = z.infer<typeof schema.Post>;
export type News = z.infer<typeof schema.News>;

// Event Types
export type Venue = z.infer<typeof schema.Venue>;
export type Event = z.infer<typeof schema.Event>;
