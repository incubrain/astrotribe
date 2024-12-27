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
