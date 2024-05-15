import openAiClient from './openaiClient'

type CallOpenAIConfig = {
  temperature?: number // Controls randomness: lower is more deterministic.
  max_tokens?: number // Maximum number of tokens to generate.
  top_p?: number // Nucleus sampling: higher allows more diversity.
}

// Asynchronous function to call the OpenAI API with specified parameters.
const callOpenAI = async (
  prompt: string, // The user's input to the model.
  schema: any, // The schema defining the function to call and its parameters.
  systemMessage: string, // A system message that provides context or instructions.
  config: CallOpenAIConfig = {} // Optional configuration for the API call.
) => {
  try {
    // Make an API call to OpenAI's chat completion endpoint.
    const { data } = await openAiClient.createChatCompletion({
      model: 'gpt-3.5-turbo', // Specifies the model to use.
      messages: [
        // An array of messages that precedes the function call.
        { role: 'system', content: systemMessage }, // System message for context.
        { role: 'user', content: prompt } // The actual prompt from the user.
      ],
      function_call: {
        // Details of the function being called via the API.
        name: schema.function // The name of the function to call.
      },
      functions: [
        // The functions available for the API to call.
        {
          name: schema.function, // The function's name.
          parameters: schema.schema // The parameters expected by the function.
        }
      ],
      // Default or provided values for the API's configuration options.
      temperature: config.temperature || 0.5, // Default or provided temperature.
      max_tokens: config.max_tokens || 600, // Default or provided max tokens.
      top_p: config.top_p || 0.7 // Default or provided top_p value.
    })

    // Return the API's response data.
    return data
  } catch (error) {
    // Log an error message if the API call fails.
    console.error('Error calling OpenAI API', error)
    // Rethrow the error for further handling.
    throw createError({ message: error.message || 'Failed to call OpenAI API' })
  }
}

export default callOpenAI
