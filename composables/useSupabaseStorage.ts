import { getImageURL } from './utils/image'

export default function useSupabaseStorage() {
  return {
    image: {
      single: getImageURL
    }
  }
}
