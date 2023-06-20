import * as upload from './supabase/storage/upload'
import { folder, avatar } from './supabase/storage/download'
import { getImageURL } from './supabase/get/image'

export default function useStorage() {
  return {
    image: {
      optimized: getImageURL
    },
    upload: {
      avatar: upload.profileSingle,
      cover: upload.profileSingle
    },
    download: {
      folder,
      avatar
    }
  }
}
