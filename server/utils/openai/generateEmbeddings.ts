import { CreateEmbeddingRequest } from 'openai'
import openaiClient from './openaiClient'
// import { z } from 'zod'

// !ignore for now:
// later we will use embeddings for article search, recommendation, and similarity checks when scraping new articles

export interface Embedding {
  // Define the structure of your embedding here. For example:
  // embeddings: number[]
  // ...other fields
}

async function generateEmbeddings(article: string): Promise<Embedding> {
  const { data: embed } = await openaiClient.createEmbedding({
    input: article,
    model: 'text-embedding-ada-002'
  } as CreateEmbeddingRequest)
  const [{ embedding }] = embed.data
  return embedding as number[]
}

export default generateEmbeddings
