// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import OpenAI from 'https://deno.land/x/openai@v4.51.0/mod.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const openAiApiKey = Deno.env.get('OPENAI_API_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')
const supabaseSerciceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

if (!supabaseSerciceKey) {
  console.error('Error: supabaseSerciceKey not set in environment variables')
  throw new Error('supabaseSerciceKey not set in environment variables')
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
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey',
}

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
  }
  catch (error) {
    console.error('Invalid JSON input:', error)
    return new Response(JSON.stringify({ error: 'Invalid JSON input' }), {
      headers,
      status: 400,
    })
  }

  const { query, match_threshold, match_count, user_id } = requestBody

  if (!query) {
    return new Response(JSON.stringify({ error: 'Query is required' }), {
      headers,
      status: 400,
    })
  }

  if (!user_id) {
    return new Response(JSON.stringify({ error: 'Plan is required' }), {
      headers,
      status: 400,
    })
  }

  try {
    const normalizedQuery = query.trim().toLowerCase()
    const supabaseServiceClient = createClient(supabaseUrl, supabaseSerciceKey)

    // Check if the query already exists
    console.log(
      'query',
      query.trim().toLowerCase(),
      query.trim().toLowerCase() === 'tell me about dark matter',
      query === 'tell me about dark matter',
    )
    const { data: existingQuery, error: checkError } = await supabaseServiceClient
      .from('searches')
      .select('*')
      .eq('input', normalizedQuery)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 means no rows were found
      console.error('Error checking existing query:', checkError)
      throw new Error(`Error checking existing query: ${checkError.message}`)
    }

    console.log('existingQuery', existingQuery)

    let embedding
    if (existingQuery) {
      // Query exists, get the embedding and update user_ids
      embedding = existingQuery.embedding

      // needs to use service_role
      const updatedUserIds = [...existingQuery.user_ids, user_id]

      const { error: updateError } = await supabaseServiceClient
        .from('searches')
        .update({
          user_ids: updatedUserIds,
        })
        .eq('input', normalizedQuery)

      if (updateError) {
        console.error('Error updating user_ids:', updateError)
        throw new Error(`Error updating user_ids: ${updateError.message}`)
      }
    }
    else {
      // Query does not exist, generate the embedding
      const embeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: normalizedQuery,
        encoding_format: 'float',
      })
      embedding = embeddingResponse.data[0].embedding
      const tokensUsed = embeddingResponse.usage.total_tokens

      // Store the question and tokens used
      const { error: questionError } = await supabaseServiceClient.from('searches').insert({
        user_ids: [user_id],
        input: normalizedQuery,
        embedding: embedding,
        tokens_used: tokensUsed,
      })

      if (questionError) {
        console.error('Error inserting question:', questionError)
        throw new Error(`Error inserting question: ${questionError.message}`)
      }
    }

    // get similar documents
    const { data: documents, error } = await supabaseServiceClient.rpc('match_research', {
      query_embedding: embedding,
      match_threshold: match_threshold || 0.78,
      match_count: match_count || 10,
    })

    if (error) {
      console.error('Error matching documents:', error)
      throw new Error(`Error matching documents: ${error.message}`)
    }

    return new Response(JSON.stringify(documents), {
      headers,
    })
  }
  catch (error: any) {
    console.error('Error processing request:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers,
      status: 500,
    })
  }
})
