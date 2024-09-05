export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) {
    return true
  }

  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return false
  }

  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) {
      return false
    }
    for (let i = 0; i < obj1.length; i++) {
      if (!deepEqual(obj1[i], obj2[i])) {
        return false
      }
    }
    return true
  }

  if (Array.isArray(obj1) || Array.isArray(obj2)) {
    return false // One is an array, the other is not
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false
    }
  }

  return true
}

export function hasValueChanged(newValue: any, currentValue: any): boolean {
  if (
    typeof newValue === 'string' ||
    typeof newValue === 'boolean' ||
    typeof newValue === 'number' ||
    newValue === null
  ) {
    return newValue !== currentValue
  }

  if (Array.isArray(newValue) || typeof newValue === 'object') {
    return !deepEqual(newValue, currentValue)
  }

  return newValue !== currentValue
}

interface UpdateData {
  [key: string]: any
}

interface CleanDataResult {
  data: UpdateData
  noDataUpdated: boolean
}

export function wasRowDataUpdated(newData: UpdateData, previousData: UpdateData): CleanDataResult {
  const updatedData: UpdateData = {}

  Object.entries(newData).forEach(([key, value]) => {
    if (hasValueChanged(value, previousData[key])) {
      updatedData[key] = value
    }
  })

  return { data: updatedData, noDataUpdated: Object.keys(updatedData).length === 0 }
}
