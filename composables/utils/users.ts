import type { UserRoles } from '@/types/types'

export const userRoleIcon = (userRoles: UserRoles) => {
  const roles = userRoles.flatMap((role) => role.title)
  console.log('rolezzzz', userRoles)

  if (roles.includes('admin')) {
    return { icon: 'eos-icons:admin-outlined', role: 'Admin' }
  }
  if (roles.includes('mentor')) {
    return { icon: 'fa6-solid:user-graduate', role: 'Mentor' }
  }
  if (roles.includes('guide')) {
    return { icon: 'octicon:telescope', role: 'Guide' }
  }
  if (roles.includes('user')) {
    return { icon: '', role: 'User' }
  }
}
