<!-- components/ReferralCapture.vue -->
<template>
  <!-- This component captures the referral data and stores it in the database -->
  <!-- It also tracks conversions and stores the conversion value -->
  <div></div>
</template>

<script setup lang="ts">
const route = useRoute()

const getVisitorId = (): string => {
  let visitorId = localStorage.getItem('visitor_id')
  if (!visitorId) {
    visitorId = crypto.randomUUID()
    localStorage.setItem('visitor_id', visitorId)
  }
  return visitorId
}

const detectDevice = (): { deviceType: string; browser: string } => {
  const ua = navigator.userAgent
  const mobile = /Mobile|Android|iPhone|iPad|iPod/i.test(ua)
  const tablet = /Tablet|iPad/i.test(ua)

  const deviceType = tablet ? 'tablet' : mobile ? 'mobile' : 'desktop'

  const browserPatterns = {
    Chrome: /Chrome/i,
    Firefox: /Firefox/i,
    Safari: /Safari/i,
    Edge: /Edge/i,
    IE: /MSIE|Trident/i,
  }

  const browser =
    Object.entries(browserPatterns).find(([_, pattern]) => pattern.test(ua))?.[0] || 'Other'

  return { deviceType, browser }
}

const captureReferral = async () => {
  try {
    const referrerCode = route.query.ref as string

    if (!referrerCode) return

    const visitorId = getVisitorId()
    const { deviceType, browser } = detectDevice()

    const referralData = {
      referrer_code: referrerCode,
      visitor_id: visitorId,
      user_agent: navigator.userAgent,
      ip_address: null,
      landing_page: window.location.pathname,
      utm_source: (route.query.utm_source as string) || null,
      utm_medium: (route.query.utm_medium as string) || null,
      utm_campaign: (route.query.utm_campaign as string) || null,
      device_type: deviceType,
      browser: browser,
      status: 'pending',
    }

    await $fetch('/api/referrals/capture', {
      method: 'POST',
      body: referralData,
    })

    localStorage.setItem('referral_code', referrerCode)
  } catch (error: any) {
    console.error('Failed to capture referral:', error)
  }
}

const markAsConverted = async (conversionValue?: number) => {
  const visitorId = localStorage.getItem('visitor_id')
  const referralCode = localStorage.getItem('referral_code')

  if (!visitorId || !referralCode) return

  try {
    await $fetch('/api/referrals/convert', {
      method: 'POST',
      body: {
        visitor_id: visitorId,
        referrer_code: referralCode,
        conversion_value: conversionValue || null,
      },
    })
  } catch (error: any) {
    console.error('Failed to mark referral as converted:', error)
  }
}

onMounted(() => {
  captureReferral()
})

defineExpose({
  markAsConverted,
})
</script>
