import * as z from 'zod'
import * as S from '../types/zod'

type ZodSchemaMap = { [key: string]: z.ZodType<any, any> }

const zod: ZodSchemaMap = {
  ...S
}

export function addLocalStorage({ dataType, data }: { data: any; dataType: string }) {
  // store validated data in localStorage
  if (process.client) {
    localStorage.setItem(dataType, JSON.stringify(data))
  }
}

export function checkDataValidity({ data, dataType, schema }: { data: any; dataType: string; schema: string }) {
  let validated
  if (!data || data.length === 0) throw createError(`There is no data to validate: ${dataType} data`)
  else if (data.length > 0) validated = zod[schema].array().parse(data)
  else validated = zod[schema].parse(data)
  if (validated.length === 1) validated = validated[0]
  addLocalStorage({ dataType, data: validated })
  if (!validated) throw createError(`Error validating ${dataType} data`)
  return validated
}

export function checkLocalStorage({ dataType }) {
  // if in localStorage, update state
  // const localStore = localStorage.getItem(dataType)
  // if (!localStore) return false

  // const parsedStore = JSON.parse(localStore)

  // if (parsedStore) return parsedStore
  return []
}
