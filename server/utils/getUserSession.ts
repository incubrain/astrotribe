import { H3Event, useSession } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
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
  const supabase = await serverSupabaseClient(event)

  const { data: newSession, error: sessionError } = await supabase.auth.getSession()
  const newAccessToken = newSession.session?.access_token ?? null
  // const newSession = await serverSupabaseUser(event)

  if (!newAccessToken || sessionError) {
    console.log(
      'No Supabase session or access token found: ',
      JSON.stringify(sessionError ?? { message: 'unknown error' })
    )
    return null
  }

  const { payload } = useJwt(newAccessToken)

  // Validate JWT and extract payload
  if (!payload.value || !payload.value.app_metadata) {
    console.error('Invalid JWT payload')
    return null
  }

  const session = await useSession(event, {
    password: `app_permissions_${newSession.session?.user.id}`,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    }
  })

  console.log('sbMetadata', payload.value.app_metadata)
  const { user_role, user_plan } = payload.value.app_metadata

  if (!user_role) {
    throw createError({ message: 'no user_role found, unable to fetch permissions' })
  }

  if (
    session.data &&
    session.data.storedAccessToken === newAccessToken &&
    session.data.user.role === user_role &&
    session.data.user.plan === user_plan
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
    storedAccessToken: newAccessToken,
    user: {
      ...newSession.session?.user,
      role: user_role,
      plan: user_plan
    },
    permissions: {
      role: permissions.role,
      plan: permissions.plan
    }
  })

  console.log('returning session data', session.data)

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