import { serverSupabaseSession, serverSupabaseClient } from '#supabase/server'

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
      plan: planPermissions,
    }
  }
  catch (error) {
    console.error('Error fetching permissions:', error.message)
    return null // Return null to indicate failure
  }
}

async function getSession() {
  const event = useEvent()
  const session = await serverSupabaseSession(event)
  return session
}

interface StoredSession {
  refresh_token: string
  expires_at: number
  user: any
}

type Operation = 'select' | 'update' | 'insert' | 'delete'

interface Permission {
  role: string
  table_name: string
  conditions: any
  permissions: Operation[]
}

interface StoredPermissions {
  refresh_token: string
  expires_at: number
  user: {
    email: string
    auth_role: string
    confirmation_sent_at: string
    confirmed_at: string
    provider: string
    providers: string[]
    identities: string[]
    avatar: string
    full_name: string
    given_name: string
    surname: string
    username: string
    user_id: string
    user_role: string
    user_plan: string
  }
  plan_permissions: Permission[]
  role_permissions: Permission[]
}

export async function validateAndUpdateSession() {
  const session = await getSession()
  if (!session) {
    return
  }

  const { user, refresh_token } = session
  if (!user || !refresh_token) {
    throw createError({
      message: `user: ${user.id} or refresh_token: ${refresh_token.length} undefined in session`,
    })
  }

  // SESSION
  const storage = useStorage('session')
  const secretKey = getCurrentSecret()
  const storageKey = `${user.id}:${secretKey}`

  // PERMISSIONS
  const storedPermissions = await storage.getItem<StoredPermissions>(`permissions:${storageKey}`)
  if (
    !storedPermissions
    || storedPermissions.expires_at < Date.now()
    || storedPermissions.refresh_token !== refresh_token
  ) {
    const { role: user_role, plan: user_plan } = user.app_metadata

    if (!user_role || !user_plan) {
      throw createError({
        message: `missing user_role: ${user_role} or user_plan: ${user_plan}, unable to fetch user permissions`,
      })

      // redirect to login page
      // clear the cookies
    }

    const permissions = await fetchPermissions(user_plan, user_role)

    if (!permissions) {
      console.error('Failed to fetch new permissions')
      return
    }

    await storage.setItem<StoredPermissions>(`permissions:${storageKey}`, {
      refresh_token,
      expires_at: Date.now() + 60 * 60 * 24 * 7 * 1000, // 1 week in milliseconds
      user: {
        ...user,
        user_id: user.id,
        user_role,
        user_plan,
        email: user.email,
        auth_role: user.role,
        confirmation_sent_at: user.confirmation_sent_at,
        confirmed_at: user.confirmed_at,
        provider: user.app_metadata.provider,
        providers: user.app_metadata.providers,
        identities: user.identities,
        avatar: formatAvatarUrl({ avatar: user.user_metadata.avatar, id: user.id }),
        full_name: user.user_metadata.full_name,
        given_name: user.user_metadata.given_name ?? user.user_metadata.given_name,
        surname: user.user_metadata.surname ?? user.user_metadata.surname,
        username: user.user_metadata.username,
      },
      plan_permissions: permissions.plan,
      role_permissions: permissions.role,
    })
  }
  else {
    console.log('Current permissions are valid and do not need updates.')
  }

  return await storage.getItem<StoredPermissions>(`permissions:${storageKey}`)
}

export async function removeSession() {
  const event = useEvent()
  const userId = getRequestHeader(event, 'X-USER-ID')
  const storage = useStorage('session')
  const secretKey = getCurrentSecret()
  const storageKey = `${userId}:${secretKey}`

  console.log('removing session', storageKey)
  await storage.removeItem(`permissions:${storageKey}`)
}

export async function getUserRolePlan() {
  const event = useEvent()
  const userId = getRequestHeader(event, 'X-USER-ID')
  const secretKey = getCurrentSecret()
  const storageKey = `${userId}:${secretKey}`

  console.log('getting user role plan', storageKey)
  const storage = useStorage('session')

  return await storage.getItem<StoredSession>(`user:${storageKey}`)
}

export async function getUserPermissions() {
  const event = useEvent()
  const userId = getRequestHeader(event, 'X-USER-ID')
  const secretKey = getCurrentSecret()
  const storageKey = `${userId}:${secretKey}`

  console.log('getting user permissions', storageKey)
  const storage = useStorage('session')

  return await storage.getItem<StoredPermissions>(`permissions:${storageKey}`)
}

// these belong somewhere else

export async function hasDBPermission(
  tableName: string,
  operation: 'select' | 'update' | 'insert' | 'delete',
): Promise<boolean> {
  const permissions = await getUserPermissions()

  if (!permissions?.role_permissions) {
    console.log('no role permissions found')
    return false
  }

  const tablePermissions = permissions.role_permissions.find(
    (item) => item.table_name === tableName,
  )

  if (!tablePermissions) {
    throw createError({
      message: `${tableName} is not a valid table_name`,
    })
  }

  return tablePermissions.permissions.includes(operation)
}

export async function hasFeaturePermission(
  feature: string,
  action: 'select' | 'update' | 'insert' | 'delete',
): Promise<boolean> {
  const permissions = await getUserPermissions()

  if (!permissions?.plan_permissions) {
    console.log('no plan permissions found')
    return false
  }

  const featurePermissions = permissions.plan_permissions.find((item) => item.feature === feature)

  if (!featurePermissions) {
    throw createError({
      message: `${feature} is not a valid feature name`,
    })
  }

  return featurePermissions[action]
}
