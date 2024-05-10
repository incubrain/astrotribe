import type { ScraperT } from '@/types/scraper'

export const configNewsPrivate: ScraperT[] = [
  {
    id: 1,
    name: 'nasa',
    urls: ['https://www.nasa.gov/news/all-news/'],
    baseUrl: 'https://www.nasa.gov',
    selectorBaseLink: '.hds-content-item',
    selectorPagination: '.next .page-numbers', // Selector for the next page link.
    selectorConfigLink: {
      title: {
        selector: '.hds-content-item-heading',
        extract: 'text'
      },
      url: {
        selector: '.hds-content-item-heading',
        extract: 'attribute',
        attributeName: 'href'
      },
      description: {
        selector: 'p',
        extract: 'text'
      },
      featured_image: {
        selector: 'figure img',
        extract: 'attribute',
        attributeName: 'src'
      }
    },
    selectorBasePage: 'article',
    selectorConfigPage: {
      body: {
        selector: '.usa-article-content',
        extract: 'text'
      },
      published_at: {
        selector:
          '.article-meta-item.grid-row.flex-align-center.border-bottom.padding-y-2 > .heading-12.text-uppercase',
        extract: 'text'
      },
      author: {
        selector: '.grid-col > .hds-meta-heading .heading-14',
        extract: 'text'
      }
    }
  }
]

// Done
// https://agnikul.in/#/

// Add

// Gov
// https://www.nsilindia.co.in/

// Community
// https://axsx.in/

// Education
// https://space-india.com/
// https://www.starlabsurat.com/
// https://spacedevelopmentnexus.com/ - host events
// http://www.heliumlearninglabs.com/
// https://spacekidzindia.in/ - medium priority
// https://www.nss-mumbai.org/ - low priority
// https://www.spaceskool.com/ - medium priority | funded by Indian Gov
// https://hexstaruniverse.com/ - medium priority | Social education
// https://astroverse.in/
// https://genex.space/
// https://astro-phile.com/
// https://www.vyomikaspace.com/
// https://www.himalayanspacecentre.org/


// Research & Development
// https://www.spaceroboticssociety.org - low priority | Robotics
// https://ananthtech.com/ - high priority - sattelite development


// Satellite Data
// https://blueskyhq.io/
// https://www.galaxeye.space/ - imaging
// https://www.satsure.co/ - Weather, Agriculture
// https://piersight.space/ - high priority - Maratime Surveillance
// https://www.numer8.in/ - medium priority - Sustainable Seafood
// https://skyserve.ai/ - high priority - SAAS Platform for satellite data companies
// https://suhora.com/#/ - medium priority - broad range of sectors
// https://www.kawa.space/ - high priority - seems established, nice site

// Space Object Tracking
// https://www.digantara.co.in/

// Cube & Nano Satellites
// https://www.eonspacelabs.com/ - Space Defence Optics
// https://satellize.com/ - Launched 2 satellites
// https://originantares.in/
// https://nspacetech.in/
// https://www.azistabst.com/ - medium priority | 2 satellites 
// https://www.dhruvaspace.com/ high priority | established

// Landers and Rovers
// https://www.teamindus.in/

// Space Defence
// https://www.parasdefence.com/ - low priority

// Space Tourism 
// https://spaceaura.com/ - medium priority
// https://www.inspecity.com/

// Mission Support
// https://deltavanalytics.com/

// Boosters & Propulsion
// https://www.manastuspace.com/
// https://dronvayu.com/ - medium priority | mostly aerospace, some launchpad tech and propulsion

// Launch Providers
// https://spacim.co.in/ - med priority | in early stages
// https://www.orbitx.in/ - high priority | in early stages, first launch 2024 of Atal Yaan Rocket
// https://www.etherealx.space/ medium priority | appears to be in the very early stages, funded
// https://abyom.com/ - medium priority | in early stages
// https://urvyam.com/
// https://spacetaxi.in/

// Stargazing Equipment / Telescopes
// https://tejraj.com/
// https://aperturetelescopes.com/

// Manufacturing
// https://astramwp.com/ - low priority | communications

// investing
// https://kicksky.space/

// Tourism
// https://astroportglobal.com/

// Comming Soon or Website Down
// https://vellon.in/
// http://www.spacefields.in/


// Not Sure
// https://www.datapatternsindia.com/ - low priority | on the fringe of space tech
// https://www.godrej.com/aerospace-and-defence
// 

// Australia
// https://www.spacemachines.co/ - high priority | modular satellites & sattelite servicing

// USA
// // https://www.axiomspace.com/

// Location Unknown
// https://www.korrai.com/
// 



// New
// https://www.omspace.in/