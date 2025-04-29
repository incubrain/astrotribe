// server/api/contact.post.ts
import { defineEventHandler, readBody } from 'h3'
import { Resend } from 'resend'
// [nitro 11:45:07 AM]  ERROR  Error: Could not load /Users/mac/Development/astronera/astrotribe/apps/website/shared/constants (imported by server/api/__sitemap__/main.ts): ENOENT: no such file or directory, open '/Users/mac/Development/astronera/astrotribe/apps/website/shared/constants'
// Define the DTO for form data

enum CONTACT_TYPE {
  CONSULTATION = 'consultation',
  MESSAGE = 'message',
  ADVERTISMENT = 'advertisement',
}

interface ContactFormDTO {
  name: string
  type: CONTACT_TYPE
  message: string
  company?: string
  email: string
  inquiry_type?: string
  phone?: string
  website?: string
  preferredDate?: string | Date
}

export default defineEventHandler(async (event) => {
  try {
    // Get runtime config
    const config = useRuntimeConfig()

    // Initialize Resend with API key
    const resend = new Resend(config.resendApiKey)

    // Read and validate the form data

    const body = await readBody<ContactFormDTO>(event)
    // Send email with Resend
    const { data, error } = await resend.emails.send({
      from: `AstronEra <${config.resendFromEmail}>`,
      to: [config.resendToEmail],
      subject: getSubject(body.type),
      html: buildHTML(body),
      // Add reply-to header with the user's email
      replyTo: body.email,
    })

    if (error) {
      console.error('Resend API error:', error)
      throw new Error(error.message)
    }

    console.log('RESEND MESSAGE SUCCESS', data)
    // Return success response with message ID for tracking
    return {
      success: true,
      message: `Your ${body.type} request has been submitted successfully`,
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

// feedback-smtp.us-east-1.amazonses.com
// v=spf1 include:amazonses.com ~all

const getSubject = (contact_type: CONTACT_TYPE) => {
  switch (contact_type) {
    case CONTACT_TYPE.CONSULTATION: {
      return 'New Consultation Request'
    }
    case CONTACT_TYPE.MESSAGE: {
      return 'New General Message'
    }
    case CONTACT_TYPE.ADVERTISMENT: {
      return 'New Advertisement Request'
    }
    default: {
      return 'New Miscellaneous Message'
    }
  }
}

const buildHTML = (form: ContactFormDTO) => {
  switch (form.type) {
    case CONTACT_TYPE.CONSULTATION: {
      // Format the date
      const formattedDate = form.preferredDate
        ? new Date(form.preferredDate).toLocaleDateString()
        : 'Not specified'

      return `
        <h2>Consultation Request</h2>
        <p><strong>From:</strong> ${form.name}</p>
        <p><strong>Company:</strong> ${form.company || 'Not provided'}</p>
        <p><strong>Email:</strong> ${form.email}</p>
        <p><strong>Phone:</strong> ${form.phone || 'Not provided'}</p>
        <p><strong>Website:</strong> ${form.website || 'Not provided'}</p>
        <p><strong>Preferred Date:</strong> ${formattedDate}</p>
        <h3>Message:</h3>
        <p>${form.message || 'No message provided'}</p>
        `
    }
    case CONTACT_TYPE.MESSAGE: {
      return `
      <h2>General Message</h2>
      <p><strong>From:</strong> ${form.name}</p>
      <p><strong>Email:</strong> ${form.email}</p>
      <p><strong>Inquiry Type: ${form.inquiry_type}}</strong>
      <p><strong>Company:</strong> ${form.company}</p>
      <p><strong>Phone:</strong> ${form.phone || 'Not provided'}</p>
      <h3>Message:</h3>
      <p>${form.message || 'No message provided'}</p>
      `
    }
    case CONTACT_TYPE.ADVERTISMENT: {
      return `
      <h2>Advertisment Request</h2>
      <p><strong>From:</strong> ${form.name}</p>
      <p><strong>Company:</strong> ${form.company}</p>
      <p><strong>Email:</strong> ${form.email}</p>
      <p><strong>Phone:</strong> ${form.phone || 'Not provided'}</p>
      <p><strong>Website:</strong> ${form.website || 'Not provided'}</p>
      <h3>Message:</h3>
      <p>${form.message || 'No message provided'}</p>
      `
    }
    default: {
      return 'Invalid Email'
    }
  }
}
