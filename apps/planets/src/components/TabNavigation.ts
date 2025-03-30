import { PLANETS } from '../utils/constants'

export class TabNavigation {
  private container: HTMLElement
  private tabs: HTMLElement[] = []
  private activeTabId: string
  private onTabChange: (planetId: string) => void

  constructor(containerId: string, initialPlanetId: string, onTabChange: (planetId: string) => void) {
    this.container = document.getElementById(containerId) as HTMLElement
    this.activeTabId = initialPlanetId
    this.onTabChange = onTabChange

    if (!this.container) {
      throw new Error(`Container element with id "${containerId}" not found`)
    }

    this.createTabs()
    this.setActiveTab(this.activeTabId)
  }

  private createTabs(): void {
    // Create tab container
    const tabContainer = document.createElement('div')
    tabContainer.className = 'planet-tabs'

    // Create tabs for each planet
    Object.values(PLANETS).forEach((planet) => {
      const tab = document.createElement('button')
      tab.className = 'planet-tab'
      tab.dataset.planetId = planet.id

      // Create color indicator
      const colorIndicator = document.createElement('span')
      colorIndicator.className = 'planet-color-indicator'
      colorIndicator.style.backgroundColor = planet.color

      // Create planet name
      const planetName = document.createElement('span')
      planetName.className = 'planet-name'
      planetName.textContent = planet.name

      // Add elements to tab
      tab.appendChild(colorIndicator)
      tab.appendChild(planetName)

      // Add click event listener
      tab.addEventListener('click', () => this.handleTabClick(planet.id))

      // Add tab to container
      tabContainer.appendChild(tab)
      this.tabs.push(tab)
    })

    // Add tab container to main container
    this.container.appendChild(tabContainer)
  }

  private handleTabClick(planetId: string): void {
    if (planetId !== this.activeTabId) {
      this.setActiveTab(planetId)
      this.onTabChange(planetId)
    }
  }

  private setActiveTab(planetId: string): void {
    // Update active tab ID
    this.activeTabId = planetId

    // Update tab classes
    this.tabs.forEach((tab) => {
      if (tab.dataset.planetId === planetId) {
        tab.classList.add('active')
      } else {
        tab.classList.remove('active')
      }
    })
  }
}
