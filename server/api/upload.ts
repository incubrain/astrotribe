// import { decode } from 'base64-arraybuffer'
import crypto from 'crypto'
import { readFormData, readMultipartFormData } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  console.log('upload eventHandler')
  const form = await readMultipartFormData(event)
  console.log('workingUpload', form)
  if (!form?.length) {
    return console.log('no form data')
  }

  console.log('file', form)

  const userId = form.find((item) => item.name === 'userId')?.data.toString()
  const fileType = form.find((item) => item.name === 'fileType')?.data.toString() as 'avatar'
  const fileName = `${fileType}-${crypto.randomUUID()}`
  const fileExtention = form[0].type?.split('/')[1]
  console.log('formData', userId, fileType, fileName, fileExtention)

  try {
    const client = await serverSupabaseClient(event)
    const { error } = await client.storage
      .from('profile-public')
      .upload(`${userId}/${fileType}/${fileName}.${fileExtention}`, form[0].data, {
        contentType: form[0].type,
        cacheControl: '3600',
        upsert: true
      })

    if (error) {
      console.log('error', error)
      throw createError({ statusMessage: error.message })
    }

    // update account with new avatar
    const { error: updateError, data } = await client
      .from('user_profiles')
      .update({ [`${fileType}`]: `${fileName}.${fileExtention}` })
      .eq('id', userId!)
      .select()

    console.log('dataReturned', data, updateError)
  } catch (error) {
    console.log('error', error)
    throw createError({ statusMessage: error.message })
  }

  return {
    statusCode: 200,
    message: 'successfully uploaded file'
  }
})
