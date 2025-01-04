import murmurhash from 'murmurhash'

// Example function to hash content
export function hashContent(content: string): number {
  return murmurhash.v3(content)
}
