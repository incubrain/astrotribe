import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const { token } = await readBody(event)
  const config = useRuntimeConfig()

  // Create form data for Turnstile verification
  const formData = new FormData()
  formData.append('secret', config.turnstileSecretKey)
  formData.append('response', token)

  // Optional: Add visitor's IP
  if (event.node.req.headers['cf-connecting-ip']) {
    formData.append('remoteip', event.node.req.headers['cf-connecting-ip'])
  }

  try {
    const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    })

    const outcome = await result.json()
    return outcome
  } catch (error) {
    console.error('Error validating Turnstile token:', error)
    return {
      success: false,
      error: 'Failed to validate token',
    }
  }
})
