import type { Tables } from '~/supabase/schema.gen'

export type RowUser = Tables<'users'>
export type RowUserFollowers = Tables<'user_followers'>
export type RowRole = Tables<'roles'>
export type RowRegisterInterest = Tables<'register_interest'>

export type RowCategory = Tables<'categories'>
export type RowTag = Tables<'tags'>

export type RowNews = Tables<'news'>
export type RowNewsTag = Tables<'news_tags'>

export type RowEmbedding = Tables<'embeddings'>
export type RowNewsEmbedding = Tables<'news_embeddings'>

export type RowPaper = Tables<'papers'>
