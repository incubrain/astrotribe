// composables/useReferralSecurity.ts
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useToast } from 'primevue/usetoast'

// Types
interface ReferralCheck {
  isValid: boolean
  reason?: string
}

interface ReferralAttempt {
  ip_address: string | null
  user_agent: string
  visitor_id: string
  referrer_code: string
  created_at: string
}

interface BlockedIP {
  id: string
  ip_address: string
  blocked_at: string
  blocked_until: string
  failed_attempts: number
  reason: string
}

interface ReferrerBlock {
  referrer_code: string
  blocked_at: string
  blocked_by: string
  reason: string
  is_permanent: boolean
}

interface SecurityMetrics {
  totalBlocked: number
  activeBlocks: number
  suspiciousAttempts: number
  lastUpdated: string
  hourlySuspiciousActivity: number[] // Add this
}

// Update the metrics ref initial state

// Store
export const useSecurityStore = defineStore('security', () => {
  const blockedIPs = ref<BlockedIP[]>([])
  const blockedReferrers = ref<ReferrerBlock[]>([])
  const metrics = ref<SecurityMetrics>({
    totalBlocked: 0,
    activeBlocks: 0,
    suspiciousAttempts: 0,
    lastUpdated: '',
    hourlySuspiciousActivity: Array(24).fill(0),
  })
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Add setters
  function setBlockedIPs(ips: BlockedIP[]) {
    blockedIPs.value = ips
  }

  function setBlockedReferrers(referrers: ReferrerBlock[]) {
    blockedReferrers.value = referrers
  }

  function setMetrics(newMetrics: SecurityMetrics) {
    metrics.value = newMetrics
  }

  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  function setError(newError: string | null) {
    error.value = newError
  }

  return {
    blockedIPs,
    blockedReferrers,
    metrics,
    isLoading,
    error,
    setBlockedIPs,
    setBlockedReferrers,
    setMetrics,
    setLoading,
    setError,
  }
})

// Main composable
export function useReferralSecurity() {
  const supabase = useSupabaseClient()
  const toast = useToast()
  const store = useSecurityStore()

  // Constants
  const MAX_REFERRALS_PER_IP = 10
  const MAX_REFERRALS_PER_DAY = 50
  const TIME_WINDOW_HOURS = 24
  const SUSPICIOUS_PATTERNS = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /headless/i,
    /phantom/i,
    /selenium/i,
    /puppeteer/i,
  ]

  // IP Reputation Cache
  const ipReputationCache = new Map<string, { blockedUntil: number; failedAttempts: number }>()

  // Add to useReferralSecurity
  async function getHourlySuspiciousActivity() {
    const { data, error } = await supabase
      .from('referrals')
      .select('created_at')
      .eq('is_suspicious', true)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours

    if (error) throw error

    // Group by hour
    const hourlyData = Array(24).fill(0)
    data?.forEach((record) => {
      const hour = new Date(record.created_at).getHours()
      hourlyData[hour]++
    })

    return hourlyData
  }

  // Fetch security data
  // Inside fetchSecurityData in useReferralSecurity
  async function fetchSecurityData() {
    store.setLoading(true)
    store.setError(null)

    try {
      console.log('Fetching security data...')

      // Fetch blocked IPs
      const { data: ips, error: ipsError } = await supabase
        .from('blocked_ips')
        .select('*')
        .order('blocked_at', { ascending: false })

      if (ipsError) throw ipsError
      console.log('Blocked IPs:', ips)

      // Fetch blocked referrers
      const { data: referrers, error: referrersError } = await supabase
        .from('referrer_blocks')
        .select('*')
        .order('blocked_at', { ascending: false })

      if (referrersError) throw referrersError
      console.log('Blocked referrers:', referrers)

      // Get suspicious attempts count
      const suspiciousCount = await getSuspiciousAttemptCount()
      const hourlyActivity = await getHourlySuspiciousActivity()

      // Update store
      store.setBlockedIPs(ips || [])
      store.setBlockedReferrers(referrers || [])
      store.setMetrics({
        totalBlocked: (ips?.length || 0) + (referrers?.length || 0),
        activeBlocks: (ips || []).filter((ip) => new Date(ip.blocked_until) > new Date()).length,
        suspiciousAttempts: suspiciousCount,
        lastUpdated: new Date().toISOString(),
        hourlySuspiciousActivity: hourlyActivity
      })

      console.log('Updated security metrics:', store.metrics)
    } catch (err) {
      console.error('Error in fetchSecurityData:', err)
      store.setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      store.setLoading(false)
    }
  }

  // Validate referral attempt
  async function validateReferralAttempt(attempt: ReferralAttempt): Promise<ReferralCheck> {
    // Basic validation checks
    if (SUSPICIOUS_PATTERNS.some((pattern) => pattern.test(attempt.user_agent))) {
      return { isValid: false, reason: 'Suspicious user agent detected' }
    }

    if (!isValidUUID(attempt.visitor_id)) {
      return { isValid: false, reason: 'Invalid visitor ID' }
    }

    if (!/^[a-zA-Z0-9_-]{3,50}$/.test(attempt.referrer_code)) {
      return { isValid: false, reason: 'Invalid referrer code format' }
    }

    // Rate limiting checks
    if (attempt.ip_address) {
      const ipCheck = await checkIPLimits(attempt.ip_address)
      if (!ipCheck.isValid) return ipCheck
    }

    const referrerCheck = await checkReferrerLimits(attempt.referrer_code)
    if (!referrerCheck.isValid) return referrerCheck

    return { isValid: true }
  }

  // Block referrer
  async function blockReferrer(code: string, reason: string = 'Suspicious activity detected') {
    try {
      const { data: existingBlock } = await supabase
        .from('referrer_blocks')
        .select('referrer_code')
        .eq('referrer_code', code)
        .single()

      if (existingBlock) {
        showToast('warn', 'Already Blocked', `Referrer ${code} is already blocked`)
        return false
      }

      const blockData: Partial<ReferrerBlock> = {
        referrer_code: code,
        blocked_at: new Date().toISOString(),
        blocked_by: 'admin',
        reason,
        is_permanent: true,
      }

      const { error: blockError } = await supabase.from('referrer_blocks').insert([blockData])

      if (blockError) throw blockError

      await updateReferralsStatus(code, 'blocked')
      await fetchSecurityData()
      showToast('success', 'Referrer Blocked', `Successfully blocked referrer ${code}`)
      return true
    } catch (error) {
      handleError('Error blocking referrer:', error)
      return false
    }
  }

  // Unblock IP
  async function unblockIP(address: string) {
    try {
      const { error: deleteError } = await supabase
        .from('blocked_ips')
        .delete()
        .eq('ip_address', address)

      if (deleteError) throw deleteError

      ipReputationCache.delete(address)

      await resetIPAttempts(address)
      await fetchSecurityData()
      showToast('success', 'IP Unblocked', `Successfully unblocked IP ${address}`)
      return true
    } catch (error) {
      handleError('Error unblocking IP:', error)
      return false
    }
  }

  // Helper functions
  async function checkIPLimits(ip: string): Promise<ReferralCheck> {
    const timeWindow = new Date()
    timeWindow.setHours(timeWindow.getHours() - TIME_WINDOW_HOURS)

    const { count, error } = await supabase
      .from('referrals')
      .select('id', { count: 'exact' })
      .eq('ip_address', ip)
      .gte('created_at', timeWindow.toISOString())

    if (error) throw error

    return {
      isValid: count < MAX_REFERRALS_PER_IP,
      reason: count >= MAX_REFERRALS_PER_IP ? 'Rate limit exceeded for IP' : undefined,
    }
  }

  async function checkReferrerLimits(code: string): Promise<ReferralCheck> {
    const timeWindow = new Date()
    timeWindow.setHours(timeWindow.getHours() - TIME_WINDOW_HOURS)

    const { count, error } = await supabase
      .from('referrals')
      .select('id', { count: 'exact' })
      .eq('referrer_code', code)
      .gte('created_at', timeWindow.toISOString())

    if (error) throw error

    if (!count) return { isValid: true }

    return {
      isValid: count < MAX_REFERRALS_PER_DAY,
      reason: count >= MAX_REFERRALS_PER_DAY ? 'Daily referral limit exceeded' : undefined,
    }
  }

  async function getSuspiciousAttemptCount(): Promise<number> {
    console.log('Getting suspicious attempt count...')
    const { count, error } = await supabase
      .from('referrals')
      .select('id', { count: 'exact' })
      .eq('is_suspicious', true)

    if (error) {
      console.error('Error getting suspicious count:', error)
      throw error
    }
    console.log('Suspicious count result:', count)
    return count || 0
  }

  async function updateReferralsStatus(code: string, status: string) {
    const { error } = await supabase.from('referrals').update({ status }).eq('referrer_code', code)

    if (error) throw error
  }

  async function resetIPAttempts(address: string) {
    const { error } = await supabase
      .from('referrals')
      .update({
        validation_attempts: 0,
        last_failed_attempt: null,
      })
      .eq('ip_address', address)

    if (error) throw error
  }

  function showToast(severity: string, summary: string, detail: string) {
    toast.add({ severity, summary, detail, life: 3000 })
  }

  function handleError(message: string, error: unknown) {
    console.error(message, error)
    showToast('error', 'Error', error instanceof Error ? error.message : 'An error occurred')
  }

  function isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(uuid)
  }

  // Initialize
  fetchSecurityData()

  return {
    // Actions
    validateReferralAttempt,
    blockReferrer,
    unblockIP,
    fetchSecurityData,

    // Constants
    MAX_REFERRALS_PER_IP,
    MAX_REFERRALS_PER_DAY,
    TIME_WINDOW_HOURS,
  }
}
