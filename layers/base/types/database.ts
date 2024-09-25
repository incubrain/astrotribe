import type { Tables } from '../../../supabase/schema.gen'

export type RowUser = Tables<'user_profiles'>
export type RowUserFollowers = Tables<'user_followers'>
export type RowRole = Tables<'roles'>
export type RowRegisterInterest = Tables<'register_interest'>

export type RowCategory = Tables<'categories'>
export type RowTag = Tables<'tags'>

export type RowNews = Tables<'news'>
export type RowNewsTag = Tables<'news_tags'>

export type RowEmbedding = Tables<'embeddings'>

export type RowPaper = Tables<'papers'>

type ArrayToUnion<A> = A extends readonly (infer T)[] ? T : never

const userCardKeys = [
  'id',
  'given_name',
  'surname',
  'username',
  'avatar',
  'followed_count',
  'followers_count',
  'plan',
] as const

export type UserCard = Pick<RowUser, ArrayToUnion<typeof userCardKeys>>
