import type { H3Event } from 'h3'
import type { AnyZodObject } from 'zod'

export async function validateBody(event: H3Event, parser: AnyZodObject) {
  const validatedBody = await readValidatedBody(event, parser.safeParse)

  if (!validatedBody.success) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Unprocessable Entity: Feedback Format',
      message: JSON.stringify(validatedBody.error.errors),
    })
  }

  return validatedBody.data
}
