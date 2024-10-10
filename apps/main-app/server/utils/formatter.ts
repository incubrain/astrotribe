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
  offset?: boolean,
) => ({
  optional: z
    .string()
    .datetime({ message: errorMsg, offset: offset ?? true })
    .optional(),
  nullish: z
    .string()
    .datetime({ message: errorMsg, offset: offset ?? true })
    .nullish(),
})

export const formatAvatarUrl = (user: any) => {
  return getImageURL({
    fileType: 'user-avatar',
    data: user,
  })
}

export type UserDTOKey = 'select:user:card' | 'select:user:profile' | 'select:user:settings'

export function roleIconMapping(role: AppRoleEnum): string {
  switch (role) {
    case 'admin':
      return 'material-symbols:shield-lock' // ADMIN
    case 'moderator':
      return 'material-symbols:manage-accounts' // MODERATOR
    case 'mentor':
      return 'mdi:account-school' // MENTOR
    case 'astroguide':
      return 'mdi:telescope' // ASTROGUIDE
    case 'user':
      return 'material-symbols:account-circle' // USER
    default:
      return 'material-symbols:account-circle' // DEFAULT
  }
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
    datetimeOffset,
  },
  toClient: {
    uuid: (userData: any) => uuid.parse(userData),
    string: (userData: any) => string.parse(userData),
    stringNullish: (userData: any) => stringNullish.parse(userData),
    stringNull: (userData: any) => stringNull.parse(userData),
    stringOptional: (userData: any) => stringOptional.parse(userData),
  },
}
