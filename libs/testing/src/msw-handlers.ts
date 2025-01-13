import { v4 as uuidv4 } from 'uuid'
import { http, HttpResponse } from 'msw'
import type { RLSPolicy, PermissionsConfig } from './types'

export const createRLSHandlers = (policies: RLSPolicy[], role: string, userId?: string) => {
  console.log(`Creating handlers for role: ${role}, userId: ${userId}`)

  const evaluatePolicy = (policy: RLSPolicy | undefined, data: any): boolean => {
    // Super admin bypass
    if (role === 'super_admin' || role === 'service_role') return true

    // If no policy, allow access
    if (!policy?.check) return true

    console.log(`Evaluating policy for ${policy.table}:`, {
      policy: policy.check,
      data,
      userId,
      role,
    })

    // Common RLS checks
    const checks: Record<string, () => boolean> = {
      'auth.uid() = user_id': () => {
        const result = userId === data.user_id
        console.log('Checking auth.uid() = user_id:', { userId, dataUserId: data.user_id, result })
        return result
      },
      'is_public = true': () => data.is_public === true,
      'auth.uid() = user_id OR is_public = true': () =>
        userId === data.user_id || data.is_public === true,
      'is_active = true': () => data.is_active === true,
      "is_active = true AND status = 'pending_review'": () =>
        data.is_active === true && data.status === 'pending_review',
    }

    const check = checks[policy.check]
    if (!check) {
      console.warn(`Unknown policy check: ${policy.check}`)
      return false
    }

    return check()
  }

  return {
    select: (table: string, mockData: any[] = []) => {
      console.log(`Creating SELECT handler for ${table}`)
      return http.get(`*/rest/v1/${table}*`, () => {
        console.log(`SELECT handler called for ${table}`)
        const policy = policies.find((p) => p.table === table && p.operation === 'SELECT')
        const filteredData = mockData.filter((row) => evaluatePolicy(policy, row))
        console.log(`Filtered data for ${table}:`, filteredData)
        return HttpResponse.json(filteredData)
      })
    },

    insert: (table: string) => {
      return http.post(`*/rest/v1/${table}`, async ({ request }) => {
        const policy = policies.find((p) => p.table === table && p.operation === 'INSERT')
        const body = await request.json()
        console.log(`INSERT request for ${table}:`, { body, policy })

        if (!evaluatePolicy(policy, body)) {
          console.log(`INSERT policy check failed for ${table}`)
          return new HttpResponse(null, { status: 403 })
        }

        return HttpResponse.json([{ id: 'mock-id', body }])
      })
    },

    update: (table: string) => {
      return http.patch(`*/rest/v1/${table}*`, async ({ request }) => {
        const policy = policies.find((p) => p.table === table && p.operation === 'UPDATE')
        const body = await request.json()
        console.log(`UPDATE request for ${table}:`, { body, policy })

        if (!evaluatePolicy(policy, body)) {
          console.log(`UPDATE policy check failed for ${table}`)
          return new HttpResponse(null, { status: 403 })
        }

        return HttpResponse.json([{ body }])
      })
    },

    delete: (table: string, mockData: any[] = []) => {
      return http.delete(`*/rest/v1/${table}*`, () => {
        const policy = policies.find((p) => p.table === table && p.operation === 'DELETE')
        console.log(`DELETE request for ${table}:`, { mockData, policy })

        if (!evaluatePolicy(policy, mockData[0])) {
          console.log(`DELETE policy check failed for ${table}`)
          return new HttpResponse(null, { status: 403 })
        }

        return new HttpResponse(null, { status: 204 })
      })
    },
  }
}

function getInheritedRoles(role: string, config: PermissionsConfig): string[] {
  const inheritedRoles: string[] = []
  let currentRole = role

  while (currentRole) {
    const roleConfig = config.roles[currentRole]
    if (roleConfig?.inherit_from?.[0]) {
      const parentRole = roleConfig.inherit_from[0]
      inheritedRoles.push(parentRole)
      currentRole = parentRole
    } else {
      break
    }
  }

  return inheritedRoles
}
