// types/bookmark.ts
export interface BookmarkContent {
  id: string
  type: string
  title: string
  description?: string
  thumbnail?: string
  url?: string
  created_at?: string
  authorName?: string
}

export interface BookmarkParams {
  content_type?: string
  folder_id?: string
  include_subfolders?: boolean
}

export interface Bookmark {
  id: string
  user_id: string
  folder_id: string | null
  content_type: string
  content_id: string
  metadata: {
    title: string
    description?: string
    thumbnail?: string
    url?: string
    created_at?: string
    authorName?: string
  }
  created_at: string
  folder?: {
    id: string
    name: string
    color: string
    is_favorite: boolean
    path?: string
  }
}

export interface Folder {
  id: string
  name: string
  color: string
  parent_id: string | null
  is_default: boolean
  is_favorite: boolean
  position: number
  path: string
  children?: Folder[]
}
