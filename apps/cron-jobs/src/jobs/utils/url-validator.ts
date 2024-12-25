import { URL } from 'url'

export class URLValidator {
  private VALID_PROTOCOLS = ['http:', 'https:']
  private MAX_URL_LENGTH = 2083 // Maximum length for most browsers and servers
  private INVALID_CHARACTERS = /[<>{}|\\^`]/ // Characters generally not allowed in URLs
  private INVALID_LINK_PATTERNS = ['javascript:', 'data:', '#', 'void(0)', 'about:blank']

  private MIN_DOMAIN_PARTS = 2

  public isValid(url: string): boolean {
    if (!url || url.length > this.MAX_URL_LENGTH) {
      return false
    }

    if (this.INVALID_LINK_PATTERNS.some((pattern) => url.includes(pattern))) {
      return false
    }

    try {
      const parsedUrl = new URL(url)

      // Check protocol
      if (!this.VALID_PROTOCOLS.includes(parsedUrl.protocol)) {
        return false
      }

      // Check for invalid characters
      if (this.INVALID_CHARACTERS.test(url)) {
        return false
      }

      // Check hostname
      if (!parsedUrl.hostname || parsedUrl.hostname.length < 1) {
        return false
      }

      if (!this.hasMinimumDomainParts(parsedUrl.hostname)) {
        return false
      }

      // Additional checks can be added here

      return true
    } catch (error: any) {
      return false
    }
  }

  private hasMinimumDomainParts(hostname: string): boolean {
    const parts = hostname.split('.')
    return parts.length >= this.MIN_DOMAIN_PARTS
  }

  public removeInvalidURLs(urls: string[]): string[] {
    return urls.filter((url) => this.isValid(url))
  }

  public normalizeURL(url: string): string {
    try {
      const parsedUrl = new URL(url)

      // Remove default ports
      if (
        (parsedUrl.protocol === 'http:' && parsedUrl.port === '80') ||
        (parsedUrl.protocol === 'https:' && parsedUrl.port === '443')
      ) {
        parsedUrl.port = ''
      }

      // Remove trailing slash if it's the only path
      if (parsedUrl.pathname === '/') {
        parsedUrl.pathname = ''
      }

      // Convert hostname to lowercase
      parsedUrl.hostname = parsedUrl.hostname.toLowerCase()

      // Sort query parameters
      parsedUrl.searchParams.sort()

      return parsedUrl.toString()
    } catch (error: any) {
      return url // Return original URL if normalization fails
    }
  }

  public isSameOrigin(url1: string, url2: string): boolean {
    try {
      const parsedUrl1 = new URL(url1)
      const parsedUrl2 = new URL(url2)
      return parsedUrl1.origin === parsedUrl2.origin
    } catch (error: any) {
      return false
    }
  }

  public getUrlWithoutFragment(url: string): string {
    try {
      const parsedUrl = new URL(url)
      parsedUrl.hash = ''
      return parsedUrl.toString()
    } catch (error: any) {
      return url
    }
  }

  public isRelativeUrl(url: string): boolean {
    return !url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('//')
  }
}
