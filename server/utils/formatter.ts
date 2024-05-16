import { z } from 'zod'

// use .default("") to set defaults, I think this makes more sense than setting defaults in the database
// can add a .catch(catchValue) value to set a value if the parsing fails

const uuid = z.string().uuid()
const string = z.string()
const stringNullish = z.string().nullish()
const stringNull = z.string().nullable()
const stringOptional = z.string().optional()

export const datetimeOffset = (
  errorMsg: string = 'Invalid datetime string! Must be UTC.',
  offset?: boolean
) => ({
  optional: z
    .string()
    .datetime({ message: errorMsg, offset: offset ?? true })
    .optional(),
  nullish: z
    .string()
    .datetime({ message: errorMsg, offset: offset ?? true })
    .nullish()
})

export const formatAvatarUrl = (user: any) => {
  return getImageURL({
    bucket: 'profile-public',
    folderPath: `${user.id}/avatar`,
    fileType: 'user-avatar',
    file: user.avatar,
    isPrivate: false
  })
}

export const formatCoverUrl = (user: any) => {
  console.log('formatCoverUrl', user)
  return getImageURL({
    bucket: 'profile-public',
    folderPath: `${user.id}/cover_image`,
    fileType: 'user-cover_image',
    file: user.cover_image,
    isPrivate: false
  })
}

export const formatDob = (date: string) => new Date(date).toISOString()

// todo:easy:1 add moderator to role table in supabase

// logic:med:med:4 - create a set of rules for formatting data to and from the database, add to DTOs
export const rules = {
  toDB: {
    uuid,
    string,
    stringNullish,
    stringNull,
    stringOptional,
    datetimeOffset
  },
  toClient: {
    uuid: (userData: any) => uuid.parse(userData),
    string: (userData: any) => string.parse(userData),
    stringNullish: (userData: any) => stringNullish.parse(userData),
    stringNull: (userData: any) => stringNull.parse(userData),
    stringOptional: (userData: any) => stringOptional.parse(userData)
  }
}
