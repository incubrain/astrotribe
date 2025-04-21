import OpenAI from 'https://deno.land/x/openai@v4.24.0/mod.ts'
const openAiApiKey = Deno.env.get('OPENAI_API_KEY')
const openai = new OpenAI({
  apiKey: openAiApiKey,
})
function normalize(vectors) {
  // Compute L2 norm (magnitude)
  const norm = Math.sqrt(vectors.reduce((sum, val) => sum + val * val, 0))
  // Normalize each component (handle zero norm case)
  return norm === 0 ? vectors.map(() => 0) : vectors.map((val) => val / norm)
}
export async function getEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      input: text,
      model: 'text-embedding-3-small',
      dimensions: 768,
    })
    return normalize(response.data[0].embedding)
  } catch (error) {
    console.error(`OpenAI Error: Could not get embeddings`, error)
    return null
  }
}
export async function embedData(items, fields) {
  try {
    for (const item of items) {
      const text = fields.inputColumns
        .map((field) => item[field])
        .filter((v) => v)
        .join(' ')
      const embedding = await getEmbedding(text)
      if (!embedding) {
        throw new Error('OpenAI Error')
      }
      item[fields.outputColumn] = JSON.stringify(embedding)
    }
    return items
  } catch (error) {
    console.log('OpenAI Error: ', error)
    return null
  }
}
