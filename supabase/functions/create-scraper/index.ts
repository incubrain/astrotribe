// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import OpenAI from 'https://deno.land/x/openai@v4.51.0/mod.ts'

const openAiApiKey = Deno.env.get('OPENAI_API_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

if (!supabaseServiceKey) {
  console.error('Error: supabaseServiceKey not set in environment variables')
  throw new Error('supabaseServiceKey not set in environment variables')
}

if (!openAiApiKey) {
  console.error('Error: OpenAI API key not set in environment variables')
  throw new Error('OpenAI API key not set in environment variables')
}

if (!supabaseUrl) {
  console.error('Error: Supabase URL not set in environment variables')
  throw new Error('Supabase URL not set in environment variables')
}

if (!supabaseKey) {
  console.error('Error: Supabase ANON KEY not set in environment variables')
  throw new Error('Supabase ANON KEY not set in environment variables')
}

console.log('Hello from Functions!')

const openai = new OpenAI({
  apiKey: openAiApiKey,
})

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey',
}

const contentTypes = [
  {
    type: 'news_link',
    systemMessage:
      'You are an assistant that extracts news links from HTML content. The JSON structure for the output should include a base selector and a configuration for extracting various fields.',
    jsonStructure: {
      selectorBaseLink: 'string(css selector)',
      selectorConfigLink: {
        url: {
          extract: 'string(attribute)',
          selector: 'string(css selector)',
          attributeName: 'string',
        },
        title: {
          extract: 'string(text)',
          selector: 'string(css selector)',
        },
        author: {
          extract: 'string(text)',
          selector: 'string(css selector)',
        },
        description: {
          extract: 'string(text)',
          selector: 'string(css selector)',
        },
        published_at: {
          extract: 'string(text)',
          selector: 'string(css selector)',
        },
      },
    },
  },
  {
    type: 'news_article',
    systemMessage:
      'You are an assistant that extracts news article details from HTML content. The JSON structure for the output should include a base selector and a configuration for extracting various fields.',
    jsonStructure: {
      selectorBaseLink: 'string(css selector)',
      selectorConfigLink: {
        url: {
          extract: 'string(attribute)',
          selector: 'string(css selector)',
          attributeName: 'string',
        },
        title: {
          extract: 'string(text)',
          selector: 'string(css selector)',
        },
        author: {
          extract: 'string(text)',
          selector: 'string(css selector)',
        },
        description: {
          extract: 'string(text)',
          selector: 'string(css selector)',
        },
        published_at: {
          extract: 'string(text)',
          selector: 'string(css selector)',
        },
      },
    },
  },
]

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers, status: 204 })
  }

  let requestBody

  try {
    console.log('PARSING REQUEST', req)
    requestBody = await req.json()
    console.log('PARSING REQUEST', requestBody)
  } catch (error) {
    console.error('Invalid JSON input:', error)
    return new Response(JSON.stringify({ error: 'Invalid JSON input' }), {
      headers,
      status: 400,
    })
  }

  const { htmlContent, contentType } = requestBody

  if (!htmlContent || !contentType) {
    return new Response(JSON.stringify({ error: 'HTML content and content type are required' }), {
      headers,
      status: 400,
    })
  }

  const contentTypeConfig = contentTypes.find((ct) => ct.type === contentType)

  if (!contentTypeConfig) {
    return new Response(JSON.stringify({ error: 'Invalid content type' }), {
      headers,
      status: 400,
    })
  }

  try {
    const systemMessage = `${contentTypeConfig.systemMessage} ${contentTypeConfig.jsonStructure}`
    const openaiResponse = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemMessage },
        {
          role: 'user',
          content: `Extract the data from the following HTML content and return it in the specified JSON structure: ${htmlContent}`,
        },
      ],
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
    })

    const generatedConfig = openaiResponse.choices[0].message.content

    return new Response(JSON.stringify({ config: generatedConfig }), {
      headers,
    })
  } catch (error: any) {
    console.error('Error processing request:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers,
      status: 500,
    })
  }
})
