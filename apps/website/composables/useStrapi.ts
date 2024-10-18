import qs from 'qs'
import { $fetch } from 'ofetch'
import { useRuntimeConfig } from '#imports'

export default function useStrapi() {
  async function fetchFromStrapi<T>(
    endpoint: string,
    params?: Record<string, any>,
    options?: RequestInit,
  ): Promise<T> {
    const baseUrl = useRuntimeConfig().public.strapiUrl
    const url = new URL(`/api/${endpoint}`, baseUrl)

    // Use qs to build the query string
    if (params) {
      const queryString = qs.stringify(params, { encodeValuesOnly: true })
      url.search = queryString
    }

    // Fetch data using $fetch
    const data = await $fetch<T>(url.toString(), {
      ...options,
    })

    if (!data) {
      throw new Error(`Strapi fetch error: ${data}`)
    }

    return data as T
  }

  return { fetchFromStrapi }
}
