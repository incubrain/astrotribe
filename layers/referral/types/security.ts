// types/security.ts
export interface BlockedIP {
  id: string
  ip_address: string
  blocked_at: string
  blocked_until: string
  failed_attempts: number
  reason: string
  created_at: string
  updated_at: string
}

export interface ReferrerBlock {
  referrer_code: string
  blocked_at: string
  blocked_by: string
  reason: string
  is_permanent: boolean
}

export interface BlockAction {
  success: boolean
  message: string
  error?: string
}
