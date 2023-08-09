import { getImageURL } from './utils/image'

export default function useStorage() {
  return {
    image: {
      single: getImageURL,
    }
  }
}
