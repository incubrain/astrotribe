import * as upload from './supabase/storage/upload'
import { folder, avatar } from './supabase/storage/download'
import { getImageURL, getStorageImages } from './utils/image'

export default function useStorage() {
  return {
    image: {
      single: getImageURL,
      many: getStorageImages
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
