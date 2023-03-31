export const removeDuplicates = <T>(arr: T[]): T[] => [...new Set(arr)]

export const sortBy = <T, K extends keyof T>(arr: T[], key: K): T[] => arr.sort((a, b) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0))