import { getImageURL, getStorageImages } from './utils/image'

export default function useStorage() {
  return {
    image: {
      single: getImageURL,
      many: getStorageImages
    }
  }
}
