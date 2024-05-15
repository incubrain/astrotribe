import type { AppRoleEnum } from './user.model'

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

export type UserDTOKey = 'select:user:card' | 'select:user:profile' | 'select:user:settings'
