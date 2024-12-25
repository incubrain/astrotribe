import tlds from 'tlds'
import { URL } from 'url'
import { URLValidator } from './url-validator'

export interface FormattedURLs {
  validUrls: string[]
  contacts: string[]
}

export class URLFormatter {
  private static readonly CONTACT_LINKS = [
    'mailto:',
    'tel:',
    'sms:',
    'whatsapp:',
    'viber:',
    'skype:',
    'facetime:',
    'zoom:',
    'slack:',
    'teams:',
    'meet:',
    'hangouts:',
    'webex:',
  ]

  private static readonly TLD_SET = new Set(tlds)

  private static readonly ACCEPTABLE_TERMS = ['pdf', 'doc', 'jpg', 'png']

  private static readonly ROUTE_PATTERNS: RegExp[] = [
    /^#\//, // Common pattern for SPA routes, e.g., "#/users"
    /^#![\/]/, // Hashbang pattern, e.g., "#!/users"
  ]

  private static readonly validator = new URLValidator()

  public static formatURLs(baseUrl: string, urls: string | string[]): FormattedURLs {
    const result: FormattedURLs = { validUrls: [], contacts: [] }

    if (typeof urls === 'string') {
      urls = [urls]
    }

    urls.forEach((url) => {
      const formattedUrl = this.formatSingleURL(baseUrl, url)
      if (formattedUrl) {
        if (formattedUrl.type === 'contact') {
          result.contacts.push(formattedUrl.url)
        } else {
          result.validUrls.push(formattedUrl.url)
        }
      }
    })

    return result
  }

  public static formatSingleURL(
    baseUrl: string,
    url: string,
  ): { url: string; type: 'contact' | 'valid' | 'invalid' } | null {
    if (this.isContactLink(url)) {
      return { url, type: 'contact' }
    }

    url = this.decodeURL(url)

    if (this.isRelativeURL(url)) {
      url = this.prependBaseURL(baseUrl, url)
    }

    if (!URLFormatter.validator.isValid(url)) {
      return null
    }

    url = this.normalizeURL(url)

    // const englishUrl = this.changeUrlLanguageToEnglish(url);
    return { url, type: 'valid' }
  }

  private static isContactLink(url: string): boolean {
    return this.CONTACT_LINKS.some((prefix) => url.toLowerCase().startsWith(prefix))
  }

  private static isValidTLD(tld: string): boolean {
    return this.TLD_SET.has(tld.toLowerCase())
  }

  static getBaseUrl(url: string): string {
    const parsedUrl = new URL(url)
    return `${parsedUrl.protocol}//${parsedUrl.host}`
  }

  private static prependBaseURL(baseUrl: string, link: string): string {
    const normalizedBaseURL = this.removeTrailingSlash(baseUrl.toLowerCase())
    baseUrl = this.getBaseUrl(normalizedBaseURL)

    if (this.isFullDomain(link)) {
      return `https://${link}`
    } else if (link.startsWith('/')) {
      return `${baseUrl}${link}`
    } else if (link.startsWith('//')) {
      return `https:${link}`
    } else if (link.startsWith('../')) {
      const newLink = link.replaceAll('../', '')
      return `${normalizedBaseURL}/${newLink}`
    } else if (link.startsWith('http')) {
      return link
    }
    return `${normalizedBaseURL}/${link}`
  }

  private static removeTrailingSlash(url: string): string {
    url = url.endsWith('/.') ? url.slice(0, -2) : url
    return url.endsWith('/') ? url.slice(0, -1) : url
  }

  private static changeUrlLanguageToEnglish(baseUrl: string): string | null {
    const languageRegex = /jap/
    const match = languageRegex.exec(baseUrl)
    if (match) {
      const languageCode = match[1]
      if (this.ACCEPTABLE_TERMS.includes(languageCode)) {
        return baseUrl
      }

      if (languageCode.length === 2) {
        return baseUrl.replace(`/${languageCode}/`, '/en/')
      } else if (languageCode.length === 3) {
        return baseUrl.replace(`/${languageCode}/`, '/eng/')
      }
    }
    return null
  }

  private static isRouteFragment(hash: string): boolean {
    // Remove the leading '#' if present
    const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash

    // Check against patterns
    return this.ROUTE_PATTERNS.some((pattern) => pattern.test(hash))
  }

  private static removeQueryParameters(url: string): string {
    try {
      const urlObj = new URL(url)
      const preservedParams = [] as string[]
      urlObj.searchParams.forEach((value, key) => {
        if (value.includes('/')) {
          preservedParams.push(`${key}=${value}`)
        }
      })
      const preservedQuery = preservedParams.length > 0 ? `?${preservedParams.join('&')}` : ''
      return `${urlObj.origin}${urlObj.pathname}${preservedQuery}`
    } catch (error: any) {
      console.error('Invalid URL:', error)
      return url
    }
  }

  private static decodeURL(url: string): string {
    try {
      return decodeURIComponent(url)
    } catch {
      return url
    }
  }
  private static normalizeURL(url: string): string {
    try {
      const parsedUrl = new URL(url)

      // Normalize protocol
      parsedUrl.protocol = parsedUrl.protocol.toLowerCase()

      // Normalize hostname
      parsedUrl.hostname = parsedUrl.hostname.toLowerCase()

      // Remove default ports
      if (
        (parsedUrl.protocol === 'http:' && parsedUrl.port === '80') ||
        (parsedUrl.protocol === 'https:' && parsedUrl.port === '443')
      ) {
        parsedUrl.port = ''
      }

      // Only remove the fragment if it's not a route
      if (!this.isRouteFragment(parsedUrl.hash)) {
        parsedUrl.hash = ''
      }

      // Normalize path
      parsedUrl.pathname = this.normalizePath(parsedUrl.pathname)

      // Sort query parameters
      parsedUrl.search = ''

      // Remove fragment unless it's part of a routing strategy
      if (!this.isRouteFragment(parsedUrl.hash)) {
        parsedUrl.hash = ''
      }

      return parsedUrl.toString()
    } catch (error: any) {
      console.error('Error normalizing URL:', error)
      return url // Return original URL if normalization fails
    }
  }

  private static normalizePath(path: string): string {
    // Remove duplicate slashes
    path = path.replace(/\/+/g, '/')

    // Remove trailing slash unless it's the root path
    return path === '/' ? path : path.replace(/\/$/, '')
  }

  private static sortQueryParameters(search: string): string {
    if (!search) return ''
    const searchParams = new URLSearchParams(search)
    const sortedParams = Array.from(searchParams.entries()).sort(([a], [b]) => a.localeCompare(b))
    return new URLSearchParams(sortedParams).toString()
  }

  private static isRelativeURL(url: string): boolean {
    return (
      !url.startsWith('http://') &&
      !url.startsWith('https://') &&
      !url.startsWith('//') &&
      !this.isFullDomain(url)
    )
  }

  private static isFullDomain(url: string): boolean {
    const parts = url.split('.')
    if (parts.length < 2) return false

    const potentialTLD = parts[parts.length - 1]

    // Check if the last part matches our TLD regex
    if (!this.isValidTLD(potentialTLD)) return false

    // Ensure it's not just a file extension
    const secondLastPart = parts[parts.length - 2]
    return (
      secondLastPart.length > 1 && !this.ACCEPTABLE_TERMS.includes(secondLastPart.toLowerCase())
    )
  }

  public static isSameOrigin(url1: string, url2: string): boolean {
    try {
      const parsedUrl1 = new URL(url1)
      const parsedUrl2 = new URL(url2)
      return parsedUrl1.origin === parsedUrl2.origin
    } catch {
      return false
    }
  }
}
