export class ContentStash {
  private validBlogUrls: Map<string, Set<string>> = new Map()
  private allInternalUrls: Map<string, Set<string>> = new Map()
  private selectedUrls: Map<string, Set<string>> = new Map()
  private paginationState: Map<string, number> = new Map()

  private debugMode: boolean = false

  constructor(debugMode: boolean = false) {
    this.debugMode = debugMode
  }

  private log(message: string): void {
    if (this.debugMode) {
      console.log(`[ContentStash] ${message}`)
    }
  }

  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled
    this.log(`Debug mode ${enabled ? 'enabled' : 'disabled'}`)
  }

  addValidBlogUrl(domain: string, url: string): boolean {
    if (!this.validBlogUrls.has(domain)) {
      this.validBlogUrls.set(domain, new Set())
    }
    const urlSet = this.validBlogUrls.get(domain)!
    if (!urlSet.has(url)) {
      urlSet.add(url)
      this.log(`Added valid blog URL for ${domain}: ${url}`)
      return true
    }
    this.log(`URL already exists as valid blog URL for ${domain}: ${url}`)
    return false
  }

  addInternalUrl(domain: string, url: string): void {
    if (!this.allInternalUrls.has(domain)) {
      this.allInternalUrls.set(domain, new Set())
    }
    this.allInternalUrls.get(domain)!.add(url)
    this.log(`Added internal URL for ${domain}: ${url}`)
  }

  isKnownInternalUrl(domain: string, url: string): boolean {
    const isKnown = this.allInternalUrls.get(domain)?.has(url) || false
    this.log(`Checking if ${url} is known for ${domain}: ${isKnown}`)
    return isKnown
  }

  addSelectedUrl(domain: string, url: string): void {
    if (!this.selectedUrls.has(domain)) {
      this.selectedUrls.set(domain, new Set())
    }
    this.selectedUrls.get(domain)!.add(url)
    this.log(`Added selected URL for ${domain}: ${url}`)
  }

  isSelectedUrl(domain: string, url: string): boolean {
    const isSelected = this.selectedUrls.get(domain)?.has(url) || false
    this.log(`Checking if ${url} is selected for ${domain}: ${isSelected}`)
    return isSelected
  }

  incrementPage(domain: string): void {
    const currentPage = this.paginationState.get(domain) || 1
    this.paginationState.set(domain, currentPage + 1)
    this.log(`Incremented page for ${domain} to ${currentPage + 1}`)
  }

  getCurrentPage(domain: string): number {
    const currentPage = this.paginationState.get(domain) || 1
    this.log(`Current page for ${domain}: ${currentPage}`)
    return currentPage
  }

  clearDomainData(domain: string): void {
    this.validBlogUrls.delete(domain)
    this.allInternalUrls.delete(domain)
    this.selectedUrls.delete(domain)
    this.paginationState.delete(domain)
    this.log(`Cleared all data for domain: ${domain}`)
  }

  flushAll(): void {
    this.validBlogUrls.clear()
    this.allInternalUrls.clear()
    this.selectedUrls.clear()
    this.paginationState.clear()
    this.log('Flushed all content stash data')
  }

  getDomainStats(domain: string): {
    validBlogUrls: number
    allInternalUrls: number
    selectedUrls: number
    currentPage: number
  } {
    const stats = {
      validBlogUrls: this.validBlogUrls.get(domain)?.size || 0,
      allInternalUrls: this.allInternalUrls.get(domain)?.size || 0,
      selectedUrls: this.selectedUrls.get(domain)?.size || 0,
      currentPage: this.paginationState.get(domain) || 1,
    }
    this.log(`Domain stats for ${domain}: ${JSON.stringify(stats)}`)
    return stats
  }

  getAllStats(): {
    domains: string[]
    totalValidBlogUrls: number
    totalInternalUrls: number
    totalSelectedUrls: number
  } {
    const domains = Array.from(
      new Set([
        ...this.validBlogUrls.keys(),
        ...this.allInternalUrls.keys(),
        ...this.selectedUrls.keys(),
      ]),
    )

    const stats = {
      domains,
      totalValidBlogUrls: Array.from(this.validBlogUrls.values()).reduce(
        (sum, set) => sum + set.size,
        0,
      ),
      totalInternalUrls: Array.from(this.allInternalUrls.values()).reduce(
        (sum, set) => sum + set.size,
        0,
      ),
      totalSelectedUrls: Array.from(this.selectedUrls.values()).reduce(
        (sum, set) => sum + set.size,
        0,
      ),
    }
    this.log(`Overall stats: ${JSON.stringify(stats)}`)
    return stats
  }
}

export const globalContentStash = new ContentStash()
