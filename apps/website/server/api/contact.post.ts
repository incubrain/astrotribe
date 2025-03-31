// server/api/contact.post.ts
import { defineEventHandler, readBody } from 'h3'
import { Resend } from 'resend'

// Define the DTO for form data
interface ContactFormDTO {
  name: string
  company: string
  email: string
  phone: string
  website: string
  preferredDate: string | Date
  message: string
}

export default defineEventHandler(async (event) => {
  try {
    // Get runtime config
    const config = useRuntimeConfig()

    // Initialize Resend with API key
    const resend = new Resend(config.resendApiKey)

    // Read and validate the form data
    const body = await readBody<ContactFormDTO>(event)

    // Basic validation
    if (!body.name || !body.email || !body.company) {
      return {
        success: false,
        message: 'Name, email, and company are required fields',
      }
    }

    // Format the date
    const formattedDate = body.preferredDate
      ? new Date(body.preferredDate).toLocaleDateString()
      : 'Not specified'

    // Send email with Resend
    const { data, error } = await resend.emails.send({
      from: `AstronEra <${config.resendFromEmail}>`,
      to: [config.resendToEmail],
      subject: `New Consultation Request: ${body.company}`,
      html: `
        <h2>New AstronEra Consultation Request</h2>
        <p><strong>From:</strong> ${body.name}</p>
        <p><strong>Company:</strong> ${body.company}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Phone:</strong> ${body.phone || 'Not provided'}</p>
        <p><strong>Website:</strong> ${body.website || 'Not provided'}</p>
        <p><strong>Preferred Date:</strong> ${formattedDate}</p>
        <h3>Message:</h3>
        <p>${body.message || 'No message provided'}</p>
      `,
      // Add reply-to header with the user's email
      replyTo: body.email,
    })

    if (error) {
      console.error('Resend API error:', error)
      throw new Error(error.message)
    }

    // Return success response with message ID for tracking
    return {
      success: true,
      message: 'Your consultation request has been submitted successfully',
      id: data?.id,
    }
  } catch (error: any) {
    // Log the error for debugging
    console.error('Email sending error:', error)

    // Return error response
    return {
      success: false,
      message: 'Failed to send your request. Please try again later.',
    }
  }
})
