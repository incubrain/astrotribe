export function USD2INR(usd: number) {
  return parseFloat((usd * USD_TO_INR).toFixed(2))
}

export function ROUND0(value: number) {
  return parseInt(value.toFixed(0))
}

export function ROUND2(value: number) {
  return parseFloat(value.toFixed(2))
}
export const CONTENT_TO_CHUNKS = (words: number) =>
  Math.ceil((words * AVG_CHAR_PER_WORD) / CHAR_CHUNK_SIZE)
