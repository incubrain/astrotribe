// utils/formatNumber.ts
export const formatNumber = (num: number): string => {
  if (num === 0) return '0'

  // Handle thousands
  if (num >= 1000 && num < 1000000) {
    const thousands = Math.floor(num / 1000)
    const remainder = Math.floor((num % 1000) / 100)
    return remainder > 0 ? `${thousands}.${remainder}k` : `${thousands}k`
  }

  // Handle millions
  if (num >= 1000000) {
    const millions = Math.floor(num / 1000000)
    const remainder = Math.floor((num % 1000000) / 100000)
    return remainder > 0 ? `${millions}.${remainder}M` : `${millions}M`
  }

  // Regular numbers
  return num.toString()
}
