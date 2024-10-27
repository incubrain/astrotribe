import { type FetchOptions, $fetch } from 'ofetch'
import qs from 'qs'
import { useRuntimeConfig } from '#imports'

interface Strapi5ResponseSingle<T> {
  data: T
  meta?: Record<string, any>
}

interface Strapi5ResponseMany<T> {
  data: T[]
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
    [key: string]: any
  }
}

interface Strapi5RequestParams {
  filters?: Record<string, any>
  populate?: any
  sort?: any
  pagination?: any
  fields?: string[]
  [key: string]: any
}

interface StrapiV5Client {
  find<T = any>(
    contentType: string,
    params?: Strapi5RequestParams,
    fetchOptions?: FetchOptions,
  ): Promise<Strapi5ResponseMany<T>>
  findOne<T = any>(
    contentType: string,
    documentId?: string | Strapi5RequestParams,
    params?: Strapi5RequestParams,
    fetchOptions?: FetchOptions,
  ): Promise<Strapi5ResponseSingle<T>>
  create<T = any>(
    contentType: string,
    data: Partial<T>,
    params?: Strapi5RequestParams,
    fetchOptions?: FetchOptions,
  ): Promise<Strapi5ResponseSingle<T>>
  update<T = any>(
    contentType: string,
    documentId: string | Partial<T>,
    data?: Partial<T>,
    params?: Strapi5RequestParams,
    fetchOptions?: FetchOptions,
  ): Promise<Strapi5ResponseSingle<T>>
  delete<T = any>(
    contentType: string,
    documentId?: string,
    fetchOptions?: FetchOptions,
  ): Promise<Strapi5ResponseSingle<T>>
}

export const useStrapi = (): StrapiV5Client => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.strapiUrl.endsWith('/')
    ? config.public.strapiUrl.slice(0, -1)
    : config.public.strapiUrl
  // Create a custom fetch client with base URL
  const client = (url: string, params?: Record<string, any>, options?: FetchOptions) => {
    let queryString = ''
    if (params) {
      queryString = qs.stringify(params, { encodeValuesOnly: true })
    }
    return $fetch(`${url}${queryString ? `?${queryString}` : ''}`, {
      baseURL: `${baseUrl}/api`,
      ...options,
    })
  }

  const find = <T = any>(
    contentType: string,
    params?: Strapi5RequestParams,
    fetchOptions?: FetchOptions,
  ): Promise<Strapi5ResponseMany<T>> => {
    return client(`/${contentType}`, params, { method: 'GET', ...fetchOptions })
  }

  const findOne = <T = any>(
    contentType: string,
    documentId?: string | Strapi5RequestParams,
    params?: Strapi5RequestParams,
    fetchOptions?: FetchOptions,
  ): Promise<Strapi5ResponseSingle<T>> => {
    if (typeof documentId === 'object') {
      params = documentId
      documentId = undefined
    }

    const path = [contentType, documentId].filter(Boolean).join('/')

    return client(`/${path}`, { method: 'GET', params, ...fetchOptions })
  }

  const create = <T = any>(
    contentType: string,
    data: Partial<T>,
    params?: Strapi5RequestParams,
    fetchOptions?: FetchOptions,
  ): Promise<Strapi5ResponseSingle<T>> => {
    return client(`/${contentType}`, { method: 'POST', body: { data }, params, ...fetchOptions })
  }

  const update = <T = any>(
    contentType: string,
    documentId: string | Partial<T>,
    data?: Partial<T>,
    params?: Strapi5RequestParams,
    fetchOptions?: FetchOptions,
  ): Promise<Strapi5ResponseSingle<T>> => {
    if (typeof documentId === 'object') {
      data = documentId
      documentId = undefined
    }

    const path = [contentType, documentId].filter(Boolean).join('/')

    return client(`/${path}`, { method: 'PUT', body: { data }, params, ...fetchOptions })
  }

  const _delete = <T = any>(
    contentType: string,
    documentId?: string,
    fetchOptions?: FetchOptions,
  ): Promise<Strapi5ResponseSingle<T>> => {
    const path = [contentType, documentId].filter(Boolean).join('/')

    return client(`/${path}`, { method: 'DELETE', ...fetchOptions })
  }

  return {
    find,
    findOne,
    create,
    update,
    delete: _delete,
  }
}
