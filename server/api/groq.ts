export default defineEventHandler(async (event) => {
  const { question } = getQuery(event)

  console.log('working', question)

  if (!question) {
    return {
      statusCode: 400,
      message: 'message is required'
    }
  }

  try {
    const chatCompletion = await getGroqChatCompletion(String(question))

    return {
      statusCode: 200,
      message: 'success',
      data: chatCompletion || ''
    }
  } catch (error) {
    console.log('error', error)
    return {
      statusCode: 500,
      message: 'error'
    }
  }
})
