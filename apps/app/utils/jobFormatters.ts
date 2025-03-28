/**
 * Utility functions for formatting job data
 */

/**
 * Format a date in a readable format
 * @param dateString ISO date string
 * @returns formatted date string
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return ''

  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

/**
 * Calculate how long ago a date was
 * @param dateString ISO date string
 * @returns formatted time ago string
 */
export function formatTimeAgo(dateString?: string): string {
  if (!dateString) return ''

  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''

  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}mo ago`
  return `${Math.floor(seconds / 31536000)}y ago`
}

/**
 * Format salary as currency
 * @param salary number
 * @param currency ISO currency code
 * @returns formatted salary string
 */
export function formatSalary(salary?: number, currency: string = 'EUR'): string {
  if (!salary) return ''

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(salary)
}

/**
 * Calculate days left until deadline
 * @param dateString ISO date string
 * @returns number of days until deadline or null if invalid date
 */
export function calculateDaysToDeadline(dateString?: string): number | null {
  if (!dateString) return null

  const deadline = new Date(dateString)
  if (isNaN(deadline.getTime())) return null

  const now = new Date()
  const timeDiff = deadline.getTime() - now.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

/**
 * Format URL to display friendly domain
 * @param url full URL string
 * @returns domain name without www.
 */
export function formatUrlDomain(url?: string): string {
  if (!url) return ''

  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace('www.', '')
  } catch {
    return url
  }
}

/**
 * Parse job description to highlight key sections
 * @param description raw job description text
 * @returns structured job description object
 */
export function parseJobDescription(description?: string): {
  overview: string
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
  remaining: string
} {
  if (!description) {
    return {
      overview: '',
      responsibilities: [],
      requirements: [],
      benefits: [],
      remaining: '',
    }
  }

  // Default return structure
  const result = {
    overview: '',
    responsibilities: [] as string[],
    requirements: [] as string[],
    benefits: [] as string[],
    remaining: '',
  }

  // Split by common section headers
  const sections = description.split(/#+\s*|\n\s*[A-Z][A-Z\s]+\s*:\s*|\n\s*[A-Z][A-Z\s]+\s*\n+/)

  // Extract overview (first section usually)
  if (sections.length > 0) {
    result.overview = sections[0].trim()
  }

  // Try to identify sections by keywords
  const responsibilitiesPattern =
    /(?:responsibilities|duties|what you['']ll do|role description|job description|what you will do)/i
  const requirementsPattern =
    /(?:requirements|qualifications|skills|what you['']ll need|what we['']re looking for|who you are)/i
  const benefitsPattern =
    /(?:benefits|perks|what we offer|compensation|package|what's in it for you|why work)/i

  sections.forEach((section, index) => {
    if (index === 0) return // Skip overview

    const sectionContent = section.trim()
    if (!sectionContent) return

    // Check previous section header (not perfect but helps)
    const prevSectionEnd = description.indexOf(sections[index - 1]) + sections[index - 1].length
    const currentSectionStart = description.indexOf(sectionContent, prevSectionEnd)
    const headerText = description.substring(prevSectionEnd, currentSectionStart).trim()

    // Decide section type
    if (
      responsibilitiesPattern.test(headerText) ||
      (index === 1 && sectionContent.split('\n').length > 2)
    ) {
      // Either explicitly responsibilities or first bullet list is likely responsibilities
      result.responsibilities = extractBulletPoints(sectionContent)
    } else if (requirementsPattern.test(headerText)) {
      result.requirements = extractBulletPoints(sectionContent)
    } else if (benefitsPattern.test(headerText)) {
      result.benefits = extractBulletPoints(sectionContent)
    } else {
      // Append to remaining content
      result.remaining += sectionContent + '\n\n'
    }
  })

  return result
}

/**
 * Extract bullet points from text
 * @param text text with potential bullet points
 * @returns array of bullet points
 */
function extractBulletPoints(text: string): string[] {
  // Match common bullet patterns: *, -, •, or number/letter followed by period or parenthesis
  const bulletPattern = /(?:^|\n)\s*(?:[*\-•]|\d+\.|\d+\)|\w\)|\w\.)\s+(.+)(?:\n|$)/g
  const bullets: string[] = []

  let match: RegExpExecArray | null
  while ((match = bulletPattern.exec(text)) !== null) {
    if (match[1] && match[1].trim()) {
      bullets.push(match[1].trim())
    }
  }

  // If no bullet points found, try splitting by newlines
  if (bullets.length === 0) {
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
  }

  return bullets
}

/**
 * Extract keywords from job description
 * @param description job description text
 * @returns array of likely keywords/skills
 */
export function extractKeywords(description?: string): string[] {
  if (!description) return []

  // Common technical skills and keywords
  const commonKeywords = [
    'JavaScript',
    'TypeScript',
    'React',
    'Vue',
    'Angular',
    'Node.js',
    'Python',
    'Java',
    'C#',
    'PHP',
    'Ruby',
    'Go',
    'Rust',
    'SQL',
    'NoSQL',
    'MongoDB',
    'PostgreSQL',
    'MySQL',
    'AWS',
    'Azure',
    'Docker',
    'Kubernetes',
    'DevOps',
    'CI/CD',
    'Git',
    'GraphQL',
    'REST API',
    'Frontend',
    'Backend',
    'Full Stack',
    'UI/UX',
    'Agile',
    'Scrum',
    'JIRA',
    'Linux',
    'Windows',
    'MacOS',
    'Mobile',
    'Android',
    'iOS',
    'Swift',
    'Kotlin',
    'Flutter',
    'React Native',
    'Machine Learning',
    'Data Science',
    'AI',
    'Blockchain',
    'Security',
    'Cloud',
    'Microservices',
    'Testing',
    'QA',
    'Product Management',
  ]

  const keywords: string[] = []

  // Check for common keywords
  commonKeywords.forEach((keyword) => {
    // Create a regex that matches the keyword as a whole word, case-insensitive
    const regex = new RegExp(`\\b${keyword.replace(/\//g, '\\/')}\\b`, 'i')
    if (regex.test(description)) {
      keywords.push(keyword)
    }
  })

  // Limit to top 10 keywords
  return keywords.slice(0, 10)
}

/**
 * Get employment type display text
 * @param type employment type code/string
 * @returns formatted employment type string
 */
export function formatEmploymentType(type?: string): string {
  if (!type) return ''

  const types: Record<string, string> = {
    ft: 'Full-time',
    pt: 'Part-time',
    contract: 'Contract',
    temp: 'Temporary',
    intern: 'Internship',
    full_time: 'Full-time',
    part_time: 'Part-time',
    freelance: 'Freelance',
    permanent: 'Permanent',
  }

  return types[type.toLowerCase()] || type
}
