// import { decode } from 'base64-arraybuffer'
import { z } from 'zod'
import { readFormData, readMultipartFormData } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { Database } from '#imports'

const fileTypeEnum = z.enum(['avatar', 'cover_image'])
const userIdSchema = z.string().uuid()

const imageParamsSchema = z.object({
  userId: userIdSchema,
  fileType: fileTypeEnum
})

export default defineEventHandler(async (event) => {
  console.log('upload eventHandler')
  const { userId, fileType } = await getValidatedQuery(event, imageParamsSchema.parse)
  const form = await readMultipartFormData(event)

  console.log('workingUpload', form, userId, fileType)
  if (!form?.length) {
    return console.log('no form data')
  }

  const fileName = `${fileType}-${userId}`
  const fileExtention = form[0].type?.split('/')[1]

  console.log('formData', userId, fileType, fileName, fileExtention)

  try {
    // validate user hase ability to insert this file
    // if they already have a file of this type, delete it
    const client = await serverSupabaseClient<Database>(event)
    const { error } = await client.storage
      .from('profile-public')
      .upload(`${userId}/${fileType}/${fileName}.${fileExtention}`, form[0].data, {
        contentType: form[0].type,
        cacheControl: '3600',
        upsert: true
      })

    if (error) {
      console.error('error', error)
      throw createError({ statusMessage: error.message })
    }

    return {
      statusCode: 200,
      statusMessage: `successfully uploaded ${fileType}`,
      data: `${fileName}.${fileExtention}`
    }
  } catch (error) {
    console.log('error', error)
    throw createError({
      statusCode: 400,
      statusMessage: error.message || 'error uploading the image'
    })
  }
})
