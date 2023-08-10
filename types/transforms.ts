import { z } from 'zod'

// Define a transformation config type
interface TransformConfig {
  convertStringsToDates?: boolean
  convertDatesToISOStrings?: boolean
  convertBigIntToString?: boolean
}

export const transformSchema = (data: any, config: TransformConfig) => {
  const transformObject = (obj: any): any => {
    const transformedObj = { ...obj }
    for (const key in obj) {
      const value = obj[key]
      try {
        // Convert valid date strings to Date objects
        if (
          typeof value === 'string' &&
          !isNaN(Date.parse(value)) &&
          config.convertStringsToDates
        ) {
          transformedObj[key] = new Date(value)
        }
        // Convert Date objects to ISO strings
        else if (value instanceof Date && config.convertDatesToISOStrings) {
          transformedObj[key] = value.toISOString()
        }
        // Convert BigInt to strings
        else if (typeof value === 'bigint' && config.convertBigIntToString) {
          transformedObj[key] = value.toString()
        }
        // Handle other types here...
      } catch (error) {
        console.error(`Error transforming key ${key}: ${error}`)
        // Optionally handle the error in some way, such as logging it or returning an error response
      }
    }
    return transformedObj
  }

  const schema = baseSchema.transform(transformObject)

  return schema.parse(data)
}
