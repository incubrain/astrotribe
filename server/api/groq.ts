export default defineEventHandler(async (event) => {
  const { question } = getQuery(event)

  console.log('working', question)

  if (!question) {
    return {
      statusCode: 400,
      error: {
        message: 'question is required'
      }
    }
  }

  try {
    const chatCompletion = await getGroqChatCompletion(String(question))

    return {
      error: null,
      statusCode: 200,
      data: chatCompletion || ''
    }
  } catch (error) {
    console.log('error', error)
    return {
      data: null,
      error,
      statusCode: 500
    }
  }
})
