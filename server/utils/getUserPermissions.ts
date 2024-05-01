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

export async function getUserPermissions() {
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

  const { user_role, user_plan } = payload.value.app_metadata

  if (
    session &&
    session.accessToken === sbSession.access_token &&
    session.userRole === user_role &&
    session.userPlan === user_plan
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
    user: {
      ...sbSession.user,
      userRole: user_role,
      userPlan: user_plan,
    },
    accessToken: sbSession.access_token,
    rolePermissions: permissions.role,
    planPermissions: permissions.plan
  })

  return session.data
}

export async function hasDBPermission(tableName: string, operation: 'select' | 'update' | 'insert' | 'delete'): Promise<boolean> {
  const permissions = await getUserPermissions()

  if (!permissions) {
    return false
  }

  const tablePermissions = permissions.rolePermissions.find(item => item.tableName === tableName)
  return tablePermissions[operation]
}
