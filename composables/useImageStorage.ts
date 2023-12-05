import { getImageURL } from './utils/image'

export default function useImageStorage() {
  return {
    image: {
      single: getImageURL
    }
  }
}
