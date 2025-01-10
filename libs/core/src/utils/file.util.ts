import fs from 'fs'
import path from 'path'

export function logFile(fileName: string, newValues: any, isReplaced: boolean = false) {
  if (process.env.NODE_ENV !== 'development') {
    return
  }

  let data: any[] = []
  const filePath = path.join('logs', `${fileName}.json`)

  if (!newValues) {
    return
  }

  if (Array.isArray(newValues) && !newValues.length) {
    return
  }

  if (!Array.isArray(newValues)) {
    newValues = [newValues]
  }

  // Extract directory from the file path and ensure it exists
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  // Read existing data if file exists
  if (fs.existsSync(filePath)) {
    try {
      data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    } catch (error: any) {
      console.error('Error parsing JSON file:', error)
    }

    if (isReplaced) {
      data = newValues
    } else {
      data.push(...newValues)
    }
  } else {
    data = newValues
  }

  // Write the updated data to the file
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}
