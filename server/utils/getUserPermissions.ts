import { H3Event, useSession } from 'h3'
import { serverSupabaseClient, serverSupabaseSession } from '#supabase/server'
import { useJwt } from '@vueuse/integrations/useJwt'

async function fetchPermissions(event: H3Event, userPlan: string, userRole: string) {
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

export async function getUserSession(forceRefresh: boolean) {
  const event = useEvent()
  const sbSession = await serverSupabaseSession(event)
  if (!sbSession || !sbSession.access_token) {
    console.log('No Supabase session or access token found')
    return null
  }

  const session = await useSession(event, {
    password: `app_permissions_${sbSession.user.id}`,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    }
  })

  // Validate JWT and extract payload
  const { payload } = useJwt(sbSession.access_token)
  if (!payload.value || !payload.value.app_metadata) {
    console.error('Invalid JWT payload')
    return null
  }

  console.log('sbMetadata', payload.value.app_metadata)
  const { user_role, user_plan } = payload.value.app_metadata

  if (!user_role) {
    throw createError({ message: 'no user_role found, unable to fetch permissions' })
  }

  if (
    session &&
    session.accessToken === sbSession.access_token &&
    session.user.role === user_role &&
    session.user.plan === user_plan
  ) {
    console.log('Session data matches, using stored permissions')
    return session.data
  }

  console.log('Fetching new permissions due to session data mismatch or missing session')
  const permissions = await fetchPermissions(event, user_plan, user_role)

  if (!permissions) {
    console.error('Failed to fetch new permissions')
    return null
  }

  // Update session with new permissions and user details
  await session.update({
    accessToken: sbSession.access_token,
    user: {
      ...sbSession.user,
      role: user_role,
      plan: user_plan
    },
    permissions: {
      role: permissions.role,
      plan: permissions.plan
    }
  })

  return session.data
}

export async function getUserPermissions(userId: string) {
  const session = await useSession(useEvent(), {
    password: `app_permissions_${userId}`,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7
    }
  })

  return session.data.permissions ?? null
}

export async function hasDBPermission(
  tableName: string,
  operation: 'select' | 'update' | 'insert' | 'delete',
  userId: string
): Promise<boolean> {
  const permissions = await getUserPermissions(userId)

  if (!permissions) {
    return false
  }

  const tablePermissions = permissions.role.find((item) => item.tableName === tableName)

  return tablePermissions[operation]
}
