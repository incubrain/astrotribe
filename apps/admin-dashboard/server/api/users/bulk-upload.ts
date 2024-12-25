import { readMultipartFormData, type MultiPartData } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'

async function upload(path: string, file: MultiPartData) {
  const supabase = serverSupabaseServiceRole(useEvent())
  const { data, error } = await supabase.storage.from('profile-public').upload(path, file.data, {
    cacheControl: '3600',
    contentType: file.type,
    upsert: true,
  })
  console.log('uploadResponse', data, error)
}

export default defineEventHandler(async (event) => {
  console.log('upload eventHandler')
  const form = await readMultipartFormData(event)
  console.log('workingUpload', form)
  if (!form?.length) {
    return console.log('no form data')
  }

  console.log('file', form)

  // we would need to fetch all users based on the file name

  try {
    const userRepository = new UserRepository()
    const users = await userRepository.selectMany<'user_profiles'>({
      tableName: 'user_profiles',
      selectStatement: 'id, given_name, surname',
    })

    form.forEach(async (file) => {
      console.log('uploading file', file)
      const fileName = file.filename
      if (!fileName) {
        console.log('no filename found')
        return
      }
      const fullName = fileName.split('.')[0]
      const [given_name, surname] = fullName.split('-')
      console.log('searching for', given_name, surname)
      const userId = users.find((user) => {
        if (!user.given_name || !user.surname) {
          return false
        }
        return (
          user.given_name.toLowerCase() === given_name && user.surname.toLowerCase() === surname
        )
      })?.id

      if (!userId) {
        console.log('no user found for', given_name, surname)
        return
      }
      console.log('name and id', given_name, surname, userId)
      console.log('uploading file for', userId, fileName)
      const newFileName = `avatar_${userId}.jpg`
      await upload(`${userId}/avatar/${newFileName}`, file)
    })
  } catch (error: any) {
    console.log('upload error', error)
    throw createError({ statusMessage: error.message })
  }

  return {
    statusCode: 200,
    message: 'successfully uploaded files',
  }
})
