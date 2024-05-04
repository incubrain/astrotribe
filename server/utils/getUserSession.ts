import { H3Event, useSession } from 'h3'
import { serverSupabaseSession, serverSupabaseClient } from '#supabase/server'
import { useJwt } from '@vueuse/integrations/useJwt'

async function fetchPermissions(userPlan: string, userRole: string) {
  const event = useEvent()
  const supabase = await serverSupabaseClient(event)
  try {
    console.log('fetching permissions for: ', userPlan, userRole)
    const { data: planPermissions, error: planError } = await supabase
      .from('plan_permissions')
      .select('*')
      .eq('plan', userPlan)

    const { data: rolePermissions, error: roleError } = await supabase
      .from('role_permissions')
      .select('*')
      .eq('role', userRole)

    if (roleError || planError) {
      console.error('error fetching permission', roleError, planError)
    }

    return {
      role: rolePermissions,
      plan: planPermissions
    }
  } catch (error) {
    console.error('Error fetching permissions:', error.message)
    return null // Return null to indicate failure
  }
}

async function getSession() {
  console.log('gettingSession')
  const event = useEvent()
  const session = await serverSupabaseSession(event)
  return session
}

function decodeSession(accessToken: string) {
  const { payload } = useJwt(accessToken)

  if (!payload.value || !payload.value.app_metadata) {
    throw createError({
      message: `missing session payload: ${payload.value}, unable to validate user`
    })
  }

  const { user_role, user_plan } = payload.value.app_metadata

  console.log(payload.value)

  if (!user_role || !user_plan) {
    throw createError({
      message: `missing user_role: ${user_role} or user_plan: ${user_plan}, unable to fetch user permissions`
    })
  }

  return {
    user_role: user_role as string,
    user_plan: user_plan as string
  }
}

interface StoredSession {
  access_token: string
  expires_at: number
  user: any
}

interface Permission {
  role: string
  table_name: string
  insert: boolean
  select: boolean
  update: boolean
  delete: boolean
}

interface StoredPermissions {
  access_token: string
  expires_at: number
  user_id: string
  user_role: string
  user_plan: string
  plan_permissions: Permission[]
  role_permissions: Permission[]
}

export async function validateAndUpdateSession() {
  const session = await getSession()
  if (!session) {
    return
  }

  const { user, access_token } = session
  if (!user || !access_token) {
    throw createError({
      message: `user: ${user.id} or access_token: ${access_token.length} undefined in session`
    })
  }

  const { user_plan, user_role } = decodeSession(access_token)

  const storage = useStorage('session')
  const secretKey = getCurrentSecret()
  console.log('secretKey', secretKey, user, user_plan, user_role)
  const storageKey = `${user.id}:${secretKey}`

  // SESSION
  const storedSession = await storage.getItem<StoredSession>(`user:${storageKey}`)
  if (
    !storedSession ||
    storedSession.expires_at < Date.now() ||
    storedSession.access_token !== access_token
  ) {
    console.log('Session expired or token mismatch, updating session.')
    await storage.setItem<StoredSession>(`user:${storageKey}`, {
      access_token,
      expires_at: Date.now() + 60 * 60 * 24 * 7, // 1 week
      user
    })
  } else {
    console.info('Current session is valid and does not need updates.')
  }

  // PERMISSIONS
  const storedPermissions = await storage.getItem<StoredPermissions>(`permissions:${storageKey}`)
  if (
    !storedPermissions ||
    storedPermissions.expires_at < Date.now() ||
    storedPermissions.access_token !== access_token
  ) {
    console.log('Permissions expired or token mismatch, fetching new permissions.')
    const permissions = await fetchPermissions(user_plan, user_role)

    if (!permissions) {
      console.error('Failed to fetch new permissions')
      return
    }

    await storage.setItem<StoredPermissions>(`permissions:${storageKey}`, {
      access_token,
      expires_at: Date.now() + 60 * 60 * 24 * 7, // 1 week in milliseconds
      user_id: user.id,
      user_role,
      user_plan,
      plan_permissions: permissions.plan,
      role_permissions: permissions.role
    })
  } else {
    console.log('Current permissions are valid and do not need updates.')
  }

  return {
    ...user,
    user_role,
    user_plan
  }
}

export async function getUserRolePlan() {
  const secretKey = getCurrentSecret()
  const storageKey = `${userId}:${secretKey}`

  console.log('getting user role plan', storageKey)
  const storage = useStorage('session')

  return await storage.getItem<StoredSession>(`user:${storageKey}`)
}

export async function getUserPermissions() {
  const secretKey = getCurrentSecret()
  const storageKey = `${userId}:${secretKey}`

  console.log('getting user permissions', storageKey)
  const storage = useStorage('session')

  return await storage.getItem<StoredPermissions>(`permissions:${storageKey}`)
}

// these belong somewhere else

export async function hasDBPermission(
  tableName: string,
  operation: 'select' | 'update' | 'insert' | 'delete'
): Promise<boolean> {
  const permissions = await getUserPermissions()

  if (!permissions?.role_permissions) {
    console.log('no role permissions found')
    return false
  }

  const tablePermissions = permissions.role_permissions.find(
    (item) => item.table_name === tableName
  )

  if (!tablePermissions) {
    throw createError({
      message: `${tableName} is not a valid table_name`
    })
  }

  return tablePermissions[operation]
}

export async function hasFeaturePermission(
  feature: string,
  action: 'select' | 'update' | 'insert' | 'delete'
): Promise<boolean> {
  const permissions = await getUserPermissions()

  if (!permissions?.plan_permissions) {
    console.log('no plan permissions found')
    return false
  }

  const featurePermissions = permissions.plan_permissions.find((item) => item.feature === feature)

  if (!featurePermissions) {
    throw createError({
      message: `${feature} is not a valid table_name`
    })
  }

  return featurePermissions[action]
}
