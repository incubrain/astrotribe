import { readFileSync, writeFileSync } from 'fs'
import dns from 'dns'
import { promisify } from 'util'
import net from 'net'
// import { parse } from 'csv-parse/sync'
// import { stringify } from 'csv-stringify/sync'

// Promisify DNS lookups
// Add DNS resolver
const resolveMx = promisify(dns.resolveMx)

// CSV parsing configuration
const CSV_OPTIONS = {
  delimiter: '|',
  skip_empty_lines: true,
  trim: true,
  relax_quotes: true,
  relax_column_count: true,
  columns: (header: string[]) => {
    return ['user_email', 'first_name', 'last_name']
  },
}

// SMTP configuration
const SMTP_CONFIG = {
  port: 25,
  timeout: 10000,
  fromEmail: 'no-reply@astronera.org',
  fromDomain: 'astronera.org',
  fallbackMX: ['aspmx.l.google.com', 'alt1.aspmx.l.google.com'],
}

// Known disposable domains
const DISPOSABLE_DOMAINS = new Set([
  'whatsvps.ru',
  'tempmail.com',
  'guerrillamail.com',
  '10minutemail.com',
  'temp-mail.org',
  'disposablemail.com',
  'mailinator.com',
  'yopmail.com',
  'sharklasers.com',
  'spam4.me',
  'dispostable.com',
  'throwawaymail.com',

  // Guerrilla Mail domains
  'grr.la',
  'guerrillamail.info',
  'guerrillamail.biz',
  'guerrillamail.com',
  'guerrillamail.de',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamailblock.com',

  // Mailinator variants
  'mailinator.com',
  'mailinator.net',
  'mailinator2.com',
  'mailinater.com',
  'mailmetrash.com',

  // YOPmail variants
  'yopmail.com',
  'yopmail.net',
  'yopmail.fr',
  'cool.fr.nf',
  'jetable.fr.nf',
  'nospam.ze.tc',
  'nomail.xl.cx',

  // 10 Minute Mail variants
  '10minutemail.com',
  '10minutemail.net',
  '10minutemail.org',
  '10minutemail.co.uk',
  '10minutemail.de',

  // Temp Mail variants
  'temp-mail.org',
  'temp-mail.ru',
  'tempmail.de',
  'tempmail.net',
  'tmpmail.net',

  // Throw Away Mail
  'throwawaymail.com',
  'trashmail.com',
  'trashmail.net',
  'trashmail.de',
  'wegwerfmail.de',
  'wegwerfmail.net',
  'wegwerfmail.org',

  // Disposable variants
  'disposable.com',
  'disposemail.com',
  'dispostable.com',
  'tempinbox.com',
  'spambox.us',

  // Known spam domains
  'spam4.me',
  'spamfree24.org',
  'spamfree24.de',
  'spamfree24.eu',
  'spamfree24.info',
  'spamfree24.net',
  'spamspot.com',

  // Suspicious Russian domains
  'whatsvps.ru',
  'tempmail.ru',
  'drop.ltd',
  'yourbrowser.ru',

  // Other common disposable services
  'getairmail.com',
  'getnada.com',
  'mohmal.com',
  'fakeinbox.com',
  'emailondeck.com',
  'temp-mail.io',
  'tempmailaddress.com',
  'burnermail.io',
  'tempmail.ninja',
])

interface EmailValidationResult {
  email: string
  firstName: string
  lastName: string
  isValid: boolean
  syntaxValid: boolean
  disposable: boolean
  mxValid: boolean
  details: string[]
}

async function checkMXRecord(domain: string): Promise<boolean> {
  try {
    const records = await resolveMx(domain)
    return records.length > 0
  } catch (error) {
    return false
  }
}

async function validateEmail(
  email: string,
  firstName: string,
  lastName: string,
): Promise<EmailValidationResult> {
  const result: EmailValidationResult = {
    email,
    firstName,
    lastName,
    isValid: false,
    syntaxValid: false,
    disposable: false,
    mxValid: false,
    details: [],
  }

  // 1. Basic syntax check
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  result.syntaxValid = emailRegex.test(email)
  if (!result.syntaxValid) {
    result.details.push('Invalid email syntax')
    return result
  }

  // 2. Check for disposable domain
  const [, domain] = email.split('@')
  result.disposable = DISPOSABLE_DOMAINS.has(domain.toLowerCase())
  if (result.disposable) {
    result.details.push('Disposable email domain detected')
    return result
  }

  // 3. Check MX records
  result.mxValid = await checkMXRecord(domain)
  if (!result.mxValid) {
    result.details.push('No valid MX records found')
    return result
  }

  // If all checks pass
  result.isValid = true
  result.details.push('All validations passed')
  return result
}

async function validateEmailList(filePath: string) {
  try {
    const fileContent = readFileSync(filePath, 'utf-8')

    const cleanContent = fileContent
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line)
      .map((line) => {
        const parts = line.split('|')
        return [parts[0], parts[1] || '', parts[2] || ''].join('|')
      })
      .join('\n')

    const records = parse(cleanContent, CSV_OPTIONS)
    const results: EmailValidationResult[] = []

    console.log(`Starting validation of ${records.length} records...`)

    for (const record of records) {
      const email = record.user_email?.trim()
      if (!email) continue

      try {
        // Add progress logging
        if (results.length % 100 === 0) {
          console.log(`Processed ${results.length} of ${records.length} records...`)
        }

        const validationResult = await validateEmail(email, record.first_name, record.last_name)
        results.push(validationResult)
      } catch (error: any) {
        console.error(`Error validating email ${email}:`, error)
        results.push({
          email,
          firstName: record.first_name,
          lastName: record.last_name,
          isValid: false,
          syntaxValid: false,
          disposable: false,
          mxValid: false,
          details: [`Validation error: ${error.message}`],
        })
      }
    }

    return results
  } catch (error: any) {
    console.error('Validation error:', error)
    if (error.code === 'CSV_RECORD_INCONSISTENT_COLUMNS') {
      console.error('CSV format error: Inconsistent column count in file')
      console.error('Line number:', error.lines)
      console.error('Problematic record:', error.record)
    }
    throw error
  }
}

async function runValidation() {
  try {
    console.log('Starting email validation...')
    const results = await validateEmailList('./real_users.csv')

    // Calculate statistics
    const totalCount = results.length
    const validCount = results.filter((r) => r.isValid).length
    const disposableCount = results.filter((r) => r.disposable).length
    const invalidSyntaxCount = results.filter((r) => !r.syntaxValid).length
    const invalidMxCount = results.filter(
      (r) => !r.mxValid && r.syntaxValid && !r.disposable,
    ).length

    console.log('\nValidation Summary:')
    console.log('------------------')
    console.log(`Total processed: ${totalCount}`)
    console.log(`Valid emails: ${validCount}`)
    console.log(`Invalid syntax: ${invalidSyntaxCount}`)
    console.log(`Disposable emails: ${disposableCount}`)
    console.log(`Invalid MX records: ${invalidMxCount}`)

    // Save detailed results
    const outputPath = './validation_results.csv'
    writeFileSync(
      outputPath,
      stringify(results, {
        header: true,
        delimiter: '|',
        columns: [
          'email',
          'firstName',
          'lastName',
          'isValid',
          'syntaxValid',
          'disposable',
          'mxValid',
          'details',
        ],
      }),
    )

    console.log(`\nDetailed results saved to ${outputPath}`)
  } catch (error) {
    console.error('Error during validation:', error)
    process.exit(1)
  }
}

runValidation()
