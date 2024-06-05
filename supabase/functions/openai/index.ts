// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import OpenAI from 'https://deno.land/x/openai@v4.24.0/mod.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0'

const apiKey = Deno.env.get('OPENAI_API_KEY')
const supabaseUrl = Deno.env.get('SB_URL')
const supabaseKey = Deno.env.get('SB_KEY')

// Check if environment variables are set
if (!apiKey) {
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
  apiKey: apiKey
})

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey'
}

Deno.serve(async (req) => {
  console.log('Request received:', req.url)
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers,
      status: 204
    })
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
      status: 400
    })
  }

  const { query, match_threshold, match_count } = requestBody

  if (!query) {
    return new Response(JSON.stringify({ error: 'Query is required' }), {
      headers,
      status: 400
    })
  }

  try {
    // Generate the embedding for the query using OpenAI
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
      encoding_format: 'float'
    })

    const embedding = embeddingResponse.data[0].embedding

    console.log('Embedding:', embedding)
    // Call the match_documents function in Supabase
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data: documents, error } = await supabase.rpc('match_research', {
      query_embedding: embedding,
      match_threshold: match_threshold || 0.78,
      match_count: match_count || 10
    })

    console.log('Matched documents:', documents, error)
    if (error) {
      console.error('Error matching documents:', error)
      throw new Error(`Error matching documents: ${error.message}`)
    }

    // Return the matched documents
    return new Response(JSON.stringify(documents), {
      headers
    })
  } catch (error: any) {
    console.error('Error processing request:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers,
      status: 500
    })
  }
})
