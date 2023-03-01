import * as z from 'zod'
import * as S from '../types/zod'

type ZodSchemaMap = { [key: string]: z.ZodType<any, any> };

const zod: ZodSchemaMap = {
  ...S
}

export function addLocalStorage({ dataType, data }) {
  // store validated data in localStorage
  console.log('addLocalStorage', dataType, data)
  localStorage.setItem(dataType, JSON.stringify(data))
  return
}

export async function checkDataValidity({ data, dataType, schema }: { data: any, dataType: string, schema: string }) {
    let validated
    console.log('validated', zod[schema].array().parse(data))
    if (data.length > 0) validated = zod[schema].array().parse(data)
    else validated = zod[schema].parse(data)
    console.log('validated',validated)
    await addLocalStorage({ dataType, data: validated })
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
