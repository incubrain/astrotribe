// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import OpenAI from 'https://deno.land/x/openai@v4.24.0/mod.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0'
const openAiApiKey = Deno.env.get('OPENAI_API_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')
import { summarizeText } from './summary.ts'
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
Deno.serve(async (req) => {
  const data = await req.json()
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers,
      status: 204,
    })
  }
  try {
    if (data.operation == 'match-research') {
      const { query, match_threshold, match_count } = await req.json()
      return await matchResearch(query, match_threshold, match_count)
    } else if (data.operation == 'summarize') {
      const { record, column } = data
      return await summarize(record.id, record[column])
    }
    return new Response('Ignored', {
      status: 200,
    })
  } catch (error) {
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
      return new Response(`Could not get summary`, {
        status: 500,
      })
    }
    console.log('Successfully retrieved summary')
    const supabase = createClient(supabaseUrl, supabaseKey)
    console.log('Updating summary in Supabase')
    console.log('ID', id)
    console.log('TEXT', text)
    console.log('SUMMARY', summary)
    const { error } = await supabase
      .from('contents')
      .update({
        summary,
      })
      .eq('id', id)
    if (error) {
      console.error(`Supabase Error ${JSON.stringify(error)}`)
      return new Response(`Error updating summary: ${JSON.stringify(error)}`, {
        status: 500,
      })
    }
    return new Response('Successfully Updated Summary', {
      status: 200,
    })
  } catch (error) {
    // 👇 This catches both OpenAI and Supabase-level errors
    console.error(`Error in summarize: ${error.message}`)
    return new Response(`Error summarizing content: ${error.message}`, {
      status: 500,
    })
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
