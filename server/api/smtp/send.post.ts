import { Resend, ErrorResponse } from 'resend'

let resend: Resend | null

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const env = useRuntimeConfig()
  if (!resend) resend = new Resend(env.RESEND_API_KEY)
  try {
    const response = await resend.emails.send({
      from: `Acme <${env.SMTP_SENDER}>`,
      to: [body.email],
      subject: body.subject,
      html: body.html
    })

    consop

    if (response.error<ErrorResponse>)
      throw createError(`Error Sending ${body.type} Email: ${error}`)

    return data
  } catch (error) {
    return { error }
  }
})
