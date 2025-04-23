// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import OpenAI from '@openai/openai'
import { createClient } from '@supabase/supabase-js'
import { summarizeText } from './summary.ts'

const openAiApiKey = Deno.env.get('OPENAI_API_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')
const doNotRun = Deno.env.get('EXIT_EDGEFUNC_EARLY') === 'true'

// Check if environment variables are set
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

const openai = new OpenAI({
  apiKey: openAiApiKey,
})

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey',
}

Deno.serve(async (req) => {
  console.log('Request received:', req.method, req.url)
  const data = await req.json()
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers,
      status: 204,
    })
  }

  if (doNotRun) {
    console.log('Skipping function execution due to EXIT_EDGEFUNC_EARLY flag')
    return new Response('Skipping function execution', {
      status: 200,
    })
  }

  try {
    if (data.operation == 'match-research') {
      const { query, match_threshold, match_count } = await req.json()
      return await matchResearch(query, match_threshold, match_count)
    } else if (data.operation == 'summarize') {
      const { record, column } = data
      summarize(record.id, record[column])
    }
    return new Response('Updating Summary', {
      status: 200,
    })
  } catch (error: any) {
    console.error('Error processing request:', JSON.stringify(error))
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers,
        status: 500,
      },
    )
  }
})
const summarize = async (id, text) => {
  try {
    const summary = await summarizeText(JSON.stringify(text))
    if (!summary) {
      console.error(`Could not get summary for ${id}`)
      return
    }
    console.log(`Successfully retrieved summary for ${id}`)
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        fetch: (input, init) =>
          fetch(input, {
            ...init,
            signal: AbortSignal.timeout(15000),
          }),
      },
    })
    console.log('Updating summary in Supabase')
    supabase
      .from('contents')
      .update({
        summary,
      })
      .eq('id', id)
      .then(({ error }) => {
        if (error) {
          console.error(`Could not update summary for ${id}`, JSON.stringify(error))
        }
        console.log(`Updated summary successfully ${id}`)
      })
  } catch (error: any) {
    console.error(`Error in summarize: ${error.message}`)
  }
}
const matchResearch = async (query, match_threshold, match_count) => {
  if (!query) {
    return new Response(
      JSON.stringify({
        error: 'Query is required',
      }),
      {
        headers,
        status: 400,
      },
    )
  }
  // Generate the embedding for the query using OpenAI
  const embeddingResponse = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
    encoding_format: 'float',
  })
  const embedding = embeddingResponse.data[0].embedding
  console.log('Embedding:', embedding)
  // Call the match_documents function in Supabase
  const supabase = createClient(supabaseUrl, supabaseKey)
  const { data: documents, error } = await supabase.rpc('match_research', {
    query_embedding: embedding,
    match_threshold: match_threshold || 0.78,
    match_count: match_count || 10,
  })
  console.log('Matched documents:', documents, error)
  if (error) {
    console.error('Error matching documents:', error)
    throw new Error(`Error matching documents: ${error.message}`)
  }
  // Return the matched documents
  return new Response(JSON.stringify(documents), {
    headers,
  })
}
