// server/api/advertising/inquiries.post.ts
import { z } from 'zod'
import { Resend } from 'resend'

const inquirySchema = z.object({
  companyName: z.string().min(1),
  website: z.string().url().optional().nullable(),
  contactName: z.string().min(1),
  email: z.string().email(),
  position: z.string().min(1),
  interestedPackage: z.string().uuid(),
  budget: z.number().optional().nullable(),
  startDate: z.string().optional(),
  objectives: z.array(z.string()),
  targetAudience: z.string().optional(),
  message: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const env = useRuntimeConfig(event)

  if (!env.resendApiKey) {
    throw new Error('NUXT_RESEND_API_KEY is not set')
  }

  try {
    const resend = new Resend(String(env.resendApiKey))

    const body = await readBody(event)
    const data = inquirySchema.parse(body)

    // Send email notification
    await resend.emails.send({
      from: 'AstronEra Advertising <notifications@astronera.org>',
      to: 'admin@astronera.org',
      subject: `New Advertising Inquiry: ${data.companyName}`,
      html: `
        <h2>New Advertising Inquiry</h2>
        
        <h3>Company Information</h3>
        <p><strong>Company:</strong> ${data.companyName}</p>
        <p><strong>Website:</strong> ${data.website || 'Not provided'}</p>
        
        <h3>Contact Information</h3>
        <p><strong>Name:</strong> ${data.contactName}</p>
        <p><strong>Position:</strong> ${data.position}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        
        <h3>Campaign Details</h3>
        <p><strong>Package Interest:</strong> ${data.interestedPackage}</p>
        <p><strong>Start Date:</strong> ${data.startDate || 'Not specified'}</p>
        <p><strong>Objectives:</strong> ${data.objectives.join(', ') || 'None specified'}</p>
        
        <h3>Additional Information</h3>
        <p><strong>Target Audience:</strong> ${data.targetAudience || 'Not provided'}</p>
        <p><strong>Message:</strong> ${data.message || 'No additional message'}</p>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error('Advertising inquiry error:', error)
    throw createError({
      statusCode: 400,
      message: 'Failed to process advertising inquiry',
    })
  }
})
