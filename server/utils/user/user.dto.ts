import { z } from 'zod'
import { BaseDTO } from '../base.dto'
import { generateSelectStatement } from '../generateSelectStatement'
import { formatCoverUrl, formatAvatarUrl, datetimeOffset, formatDob } from '../formatter'
import { userSchema, roleSchema } from './user.model'

type RoleId = 1 | 2 | 3 | 4 | 5 | 6 | 7
function roleIconMapping(roleId: RoleId): string {
  switch (roleId) {
    case 7:
      return 'material-symbols:shield-lock' // ADMIN
    case 6:
      return 'material-symbols:manage-accounts' // MODERATOR
    case 5:
      return 'mdi:account-school' // MENTOR
    case 4:
      return 'mdi:book-education' // TEACHER
    case 3:
      return 'mdi:telescope' // ASTROGUIDE
    case 2:
      return 'material-symbols:menu-book-rounded' // STUDENT
    case 1:
      return 'material-symbols:account-circle' // USER
    default:
      return 'mdi:shield-account' // DEFAULT
  }
}
type RoleSchema = z.infer<typeof roleSchema>

const formatRoleIcon = (role: RoleSchema) => {
  return {
    ...role,
    icon: roleIconMapping(role.id as RoleId)
  }
}

const roleWithIconSchema = roleSchema.extend({
  icon: z.string().optional() // Ensure the Zod schema reflects the new 'icon' field
})

export type UserDTOKey = 'select:user:card' | 'select:user:profile' | 'select:user:settings'
const pickUserProfile = {
  id: true,
  email: true,
  username: true,
  given_name: true,
  surname: true,
  avatar: true,
  cover_image: true,
  introduction: true,
  quote: true,
  dob: true,
  roles: true
} as const

const pickUserSettings = {
  id: true,
  email: true,
  username: true,
  given_name: true,
  surname: true,
  introduction: true,
  quote: true,
  dob: true
} as const

const pickUserCard = {
  id: true,
  username: true,
  given_name: true,
  surname: true,
  avatar: true,
  last_seen: true,
  introduction: true,
  roles: true
} as const

const userProfileSchema = userSchema.pick(pickUserProfile).transform((user) => ({
  ...user,
  avatar: user.avatar ? formatAvatarUrl(user) : undefined,
  last_seen: user.last_seen ? datetimeOffset(user.last_seen) : undefined,
  roles: user.roles ? formatRoleIcon(user.roles) : undefined,
  cover_image: user.cover_image ? formatCoverUrl(user) : undefined,
  dob: user.dob ? formatDob(user.dob) : undefined
}))

const userSettingsSchema = userSchema.pick(pickUserSettings).extend({
  last_seen: datetimeOffset('userCard:last_seen - Incorrect Date Format').optional,
  dob: z.string().transform(formatDob).optional(),
  roles: roleWithIconSchema.transform((data) => formatRoleIcon(data))
})

const userCardSchema = userSchema.pick(pickUserCard).transform((user) => ({
  ...user,
  avatar: user.avatar ? formatAvatarUrl(user) : undefined,
  last_seen: user.last_seen ? datetimeOffset(user.last_seen) : undefined,
  roles: user.roles ? formatRoleIcon(user.roles) : undefined
}))

type UserCardType = z.output<typeof userCardSchema> & {
  avatar: string
  last_seen: string | null
  roles: z.infer<typeof roleWithIconSchema>
}

type UserDTOSchema =
  | UserCardType
  | z.infer<typeof userSettingsSchema>
  | z.infer<typeof userCardSchema>

export class UserDTO extends BaseDTO<UserDTOSchema> {
  constructor() {
    super([
      {
        name: 'select:user:profile',
        schema: userProfileSchema
      },
      {
        name: 'select:user:settings',
        schema: userSettingsSchema
      },
      {
        name: 'select:user:card',
        schema: userCardSchema
      }
    ])
  }
}
