import { readFileSync, writeFileSync } from 'fs'
// import { parse } from 'csv-parse/sync'
// import { stringify } from 'csv-stringify/sync'

interface UserRecord {
  user_email: string
  first_name: string
  last_name: string
}

interface ValidationResult {
  validEmails: UserRecord[]
  invalidEmails: string[]
  duplicates: string[]
  nonLowercase: string[]
  suspiciousEmails: string[]
  totalCount: number
}

function isSuspiciousEmail(email: string, firstName: string, lastName: string): boolean {
  // Convert to lowercase for consistency
  email = email.toLowerCase()
  firstName = firstName.toLowerCase()
  lastName = lastName.toLowerCase()

  const suspiciousPatterns = [
    // Excessive dots in local part
    /\.{2,}|(?:\.[a-z]){4,}/,
    // Random-looking strings
    /balkonvem[a-z]{6,}/,
    // Suspicious domains
    /@whatsvps\.ru$/,
    // Excessive numbers in email
    /\d{4,}/,
    // Suspicious name patterns
    /^[a-z]+vem[a-z]+$/,
    // Very long local part
    /^[^@]{30,}@/,
    // Alternating letters and dots
    /^([a-z]\.){4,}/,
  ]

  // Check patterns
  if (suspiciousPatterns.some((pattern) => pattern.test(email))) {
    return true
  }

  // Check if first name or last name contains suspicious patterns
  if (firstName.includes('balkonvem') || lastName.includes('balkonvem')) {
    return true
  }

  // Check for excessive dots ratio in local part
  const localPart = email.split('@')[0]
  const dotCount = (localPart.match(/\./g) || []).length
  const dotRatio = dotCount / localPart.length
  if (dotRatio > 0.3) {
    // If more than 30% of characters are dots
    return true
  }

  return false
}

function validateEmails(filePath: string): ValidationResult {
  const fileContent = readFileSync(filePath, 'utf-8')
  const records = parse(fileContent, {
    columns: true,
    delimiter: ',',
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
  })

  const result: ValidationResult = {
    validEmails: [],
    invalidEmails: [],
    duplicates: [],
    nonLowercase: [],
    suspiciousEmails: [],
    totalCount: records.length,
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const seenEmails = new Set<string>()

  for (const record of records) {
    const email = (record.user_email || record.billing_email || '').trim()
    const firstName = (record.first_name || record.billing_first_name || '').trim()
    const lastName = (record.last_name || record.billing_last_name || '').trim()

    if (!email) continue

    // Check if email is valid format
    if (!emailRegex.test(email)) {
      result.invalidEmails.push(email)
      continue
    }

    // Check if email is suspicious
    if (isSuspiciousEmail(email, firstName, lastName)) {
      result.suspiciousEmails.push(email)
      continue
    }

    // Check for lowercase
    if (email !== email.toLowerCase()) {
      result.nonLowercase.push(email)
    }

    // Check for duplicates
    if (seenEmails.has(email.toLowerCase())) {
      result.duplicates.push(email)
    } else {
      seenEmails.add(email.toLowerCase())
      result.validEmails.push({
        user_email: email.toLowerCase(),
        first_name: firstName,
        last_name: lastName,
      })
    }
  }

  return result
}

try {
  const results = validateEmails('scripts/users.csv')

  console.log('\nEmail Validation Summary:')
  console.log('------------------------')
  console.log(`Total input records: ${results.totalCount}`)
  console.log(`Valid unique emails: ${results.validEmails.length}`)

  console.log('\nDetailed Results:')
  console.log('----------------')
  console.log(`Invalid format: ${results.invalidEmails.length}`)
  console.log(`Suspicious emails: ${results.suspiciousEmails.length}`)
  console.log(`Duplicate emails: ${results.duplicates.length}`)
  console.log(`Non-lowercase emails: ${results.nonLowercase.length}`)

  console.log('\nSuspicious Email Samples:')
  console.log(results.suspiciousEmails.slice(0, 10))

  const outputFileName = 'real_users.csv'
  const outputCsv = stringify(results.validEmails, {
    header: true,
    delimiter: '|',
  })

  writeFileSync(outputFileName, outputCsv)
  console.log(`\nValid records have been saved to ${outputFileName}`)
} catch (error) {
  console.error('Error processing file:', error.message)
}
