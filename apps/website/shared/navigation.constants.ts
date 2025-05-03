// shared/constants/pages.ts
export interface PageInfo {
  key: string
  title: string
  description: string
  path: string
  icon?: string
  sitemap: 'main' | 'blog' | 'policies'
  priority?: number
  lastModified?: string
  parentKey?: string // For hierarchical structure
}

// Define all pages in a flat structure
export const PAGES: PageInfo[] = [
  // Main pages
  {
    key: 'home',
    title: 'AstronEra: Your Gateway to the Stars',
    description: 'Connect, learn, and unravel the cosmos with astronomers and space enthusiasts',
    path: '/',
    sitemap: 'main',
    priority: 1.0,
    icon: 'i-mdi-home',
    lastModified: new Date().toISOString(),
  },
  {
    key: 'about',
    title: 'About',
    description: "Learn about AstronEra's mission and vision",
    path: '/about',
    sitemap: 'main',
    priority: 0.9,
    icon: 'i-mdi-information-outline',
    parentKey: 'about-section',
    lastModified: new Date().toISOString(),
  },
  {
    key: 'team',
    title: 'Our Team',
    description: 'Meet the passionate team behind AstronEra',
    path: '/team',
    sitemap: 'main',
    priority: 0.8,
    icon: 'i-mdi-account-group-outline',
    parentKey: 'about-section',
    lastModified: new Date().toISOString(),
  },
  {
    key: 'advertising',
    title: 'Advertising',
    description: 'Learn about advertising opportunities with AstronEra',
    path: '/advertising',
    sitemap: 'main',
    priority: 0.7,
    icon: 'i-mdi-bullhorn-outline',
    parentKey: 'about-section',
    lastModified: new Date().toISOString(),
  },
  {
    key: 'contact',
    title: 'Contact Us',
    description: 'Get in touch with the AstronEra team',
    path: '/contact',
    sitemap: 'main',
    priority: 0.8,
    icon: 'i-mdi-phone-outline',
    parentKey: 'about-section',
    lastModified: new Date().toISOString(),
  },

  // Events
  {
    key: 'telescope-workshop',
    title: 'Telescope Workshop',
    description: 'Learn about telescopes and how to use them effectively',
    path: '/events/telescope-workshop',
    sitemap: 'main',
    priority: 0.7,
    icon: 'i-mdi-telescope',
    parentKey: 'events',
    lastModified: new Date().toISOString(),
  },

  // Dark Sky
  {
    key: 'darksky',
    title: 'Conservation',
    description: 'Learn about dark sky conservation efforts',
    path: '/darksky',
    sitemap: 'main',
    priority: 0.9,
    icon: 'i-mdi-weather-night',
    parentKey: 'darksky-section',
    lastModified: new Date().toISOString(),
  },
  {
    key: 'conferences',
    title: 'Conferences',
    description: 'Information about dark sky conservation conferences',
    path: '/conferences',
    sitemap: 'main',
    priority: 0.8,
    icon: 'i-mdi-presentation',
    parentKey: 'darksky-section',
    lastModified: new Date().toISOString(),
  },
  {
    key: 'idspac-2023',
    title: 'IDSPAC 2023',
    description:
      'Information about the International Dark Sky Preservation and AstroTourism Conference 2023',
    path: '/conferences/idspac-2023',
    sitemap: 'main',
    priority: 0.7,
    icon: 'i-mdi-calendar-star',
    parentKey: 'conferences',
    lastModified: new Date().toISOString(),
  },
  {
    key: 'astrotribe',
    title: 'AstroTribe',
    description: 'Information about the AstroTribe project',
    path: '/projects/astrotribe',
    sitemap: 'main',
    priority: 0.7,
    icon: '',
    parentKey: 'darksky-section',
    lastModified: new Date().toISOString(),
  },
  {
    key: 'ladakh-2024',
    title: 'Ladakh 2024',
    description: 'Information about the AstroTribe Ladakh 2024 project',
    path: '/projects/astrotribe/ladakh-2024',
    sitemap: 'main',
    priority: 0.7,
    icon: '',
    parentKey: 'astrotribe',
    lastModified: new Date().toISOString(),
  },
  {
    key: 'nashik-2024',
    title: 'Nashik 2024',
    description: 'Information about the AstroTribe Nashik 2023 project',
    path: '/projects/astrotribe/nashik-2023',
    sitemap: 'main',
    priority: 0.7,
    icon: '',
    parentKey: 'astrotribe',
    lastModified: new Date().toISOString(),
  },
  {
    key: 'symposiums',
    title: 'Symposiums',
    description: 'Information about dark sky symposiums',
    path: '/symposiums',
    sitemap: 'main',
    priority: 0.8,
    icon: 'i-mdi-school-outline',
    parentKey: 'darksky-section',
    lastModified: new Date().toISOString(),
  },
  {
    key: 'symposium-2025',
    title: 'IDSPS Symposium 2025',
    description: 'Information about the International Dark Sky Preservation Symposium 2025',
    path: '/symposiums/symposium-2025',
    sitemap: 'main',
    priority: 0.7,
    icon: 'i-mdi-calendar-star',
    parentKey: 'symposiums',
    lastModified: new Date().toISOString(),
  },

  // Blog pages
  {
    key: 'blog',
    title: 'AstronEra Blog',
    description: 'Articles and insights on astronomy and space exploration',
    path: '/blog/category/all',
    sitemap: 'blog',
    priority: 0.9,
    icon: 'i-mdi-book-open-outline',
  },
  {
    key: 'blog-dark-sky-conservation',
    title: 'Dark Sky Conservation Articles',
    description: 'Articles on dark sky conservation efforts',
    path: '/blog/category/dark-sky-conservation',
    sitemap: 'blog',
    priority: 0.8,
    icon: 'i-mdi-nature-outline',
    parentKey: 'blog',
    lastModified: new Date().toISOString(),
  },
  {
    key: 'blog-people-of-space',
    title: 'People of Space Articles',
    description: 'Articles featuring people in space science',
    path: '/blog/category/people-of-space',
    sitemap: 'blog',
    priority: 0.8,
    icon: 'i-mdi-account-group-outline',
    parentKey: 'blog',
    lastModified: new Date().toISOString(),
  },
  {
    key: 'blog-space-exploration',
    title: 'Space Exploration Articles',
    description: 'Articles on space exploration missions',
    path: '/blog/category/space-exploration',
    sitemap: 'blog',
    priority: 0.8,
    icon: 'i-mdi-rocket-launch-outline',
    parentKey: 'blog',
    lastModified: new Date().toISOString(),
  },
  {
    key: 'blog-sustainable-development',
    title: 'Sustainable Development Articles',
    description: 'Articles on sustainable development in space science',
    path: '/blog/category/sustainable-development',
    sitemap: 'blog',
    priority: 0.8,
    icon: 'i-mdi-leaf',
    parentKey: 'blog',
    lastModified: new Date().toISOString(),
  },
  {
    key: 'blog-research',
    title: 'Research Articles',
    description: 'Articles on research in astronomy and space science',
    path: '/blog/category/research',
    sitemap: 'blog',
    priority: 0.8,
    icon: 'i-mdi-book-open-outline',
    parentKey: 'blog',
    lastModified: new Date().toISOString(),
  },
  {
    key: 'blog-organisations',
    title: 'Organisations Articles',
    description: 'Articles on organisations in space science',
    path: '/blog/category/organisations',
    sitemap: 'blog',
    priority: 0.8,
    icon: 'i-mdi-account-multiple-outline',
    parentKey: 'blog',
    lastModified: new Date().toISOString(),
  },
  // Blog pages
  {
    key: 'courses',
    title: 'Courses',
    description: 'AstronEra Courses',
    path: '/courses',
    sitemap: 'main',
    priority: 0.9,
    icon: 'i-mdi-book-open-outline',
  },

  // Policy pages
  {
    key: 'privacy-policy',
    title: 'Privacy Policy',
    description: "AstronEra's privacy policy",
    path: '/policies/privacy-policy',
    sitemap: 'policies',
    priority: 0.5,
    lastModified: new Date().toISOString(),
  },
  {
    key: 'terms-of-use',
    title: 'Terms of Use',
    description: "AstronEra's terms of use",
    path: '/policies/terms-of-use',
    sitemap: 'policies',
    priority: 0.5,
    lastModified: new Date().toISOString(),
  },
  {
    key: 'cookies-policy',
    title: 'Cookies Policy',
    description: "AstronEra's cookies policy",
    path: '/policies/cookies-policy',
    sitemap: 'policies',
    priority: 0.5,
    lastModified: new Date().toISOString(),
  },
  {
    key: 'refund-policy',
    title: 'Refund Policy',
    description: "AstronEra's refund policy",
    path: '/policies/refund-policy',
    sitemap: 'policies',
    priority: 0.5,
    lastModified: new Date().toISOString(),
  },
]

// Navigation structure definitions for top menu (these don't need to be pages themselves)
export const NAV_SECTIONS = [
  {
    key: 'about-section',
    label: 'About',
    icon: 'i-mdi-information-outline',
  },
  {
    key: 'events',
    label: 'Events',
    icon: 'i-mdi-calendar-month-outline',
  },
  {
    key: 'darksky-section',
    label: 'Dark Sky',
    icon: 'i-mdi-weather-night',
  },
]

// Footer structure definitions
export const FOOTER_SECTIONS = [
  {
    key: 'about-section',
    label: 'About Us',
    icon: 'material-symbols:info',
  },
  {
    key: 'darksky-section',
    label: 'Dark Skies',
    icon: 'material-symbols:nightlight',
    // We can override which children to show in the footer
    //showKeys: ['dark-sky-conference-2023'],
  },
  {
    key: 'blog',
    label: 'Blog',
    icon: 'material-symbols:menu-book-outline',
  },
]

// Helper functions
export function getPagesBySitemap(sitemapType: string): PageInfo[] {
  return PAGES.filter((page) => page.sitemap === sitemapType)
}

export function getPageByKey(key: string): PageInfo | undefined {
  return PAGES.find((page) => page.key === key)
}

export function getPolicyPages(): PageInfo[] {
  return PAGES.filter((page) => page.sitemap === 'policies')
}

export function getPolicyPageKeys(): string[] {
  return getPolicyPages().map((page) => page.key)
}

// Build navigation menu automatically

interface NavItem {
  key: string
  label: string
  icon: string | undefined
  visible: boolean
  disabled: boolean
  url?: string
  items?: NavItem[]
}

export function getNavigation() {
  const navItems: NavItem[] = []

  // Add each top-level section
  for (const section of NAV_SECTIONS) {
    const childPages = PAGES.filter((page) => page.parentKey === section.key)

    // Skip empty sections
    if (childPages.length === 0) continue

    // Create the nav item for this section
    const navItem = {
      key: section.key,
      label: section.label,
      icon: section.icon,
      visible: true,
      disabled: false,
      items: childPages.map((page) => {
        // Check if this page has children
        const grandchildren = PAGES.filter((p) => p.parentKey === page.key)

        const item: NavItem = {
          key: page.key,
          label: page.title.split(':')[0], // Only use the first part of the title
          icon: page.icon,
          url: page.path,
          visible: true,
          disabled: false,
        }

        // Add grandchildren if they exist
        if (grandchildren.length > 0) {
          item.items = grandchildren.map((child) => ({
            key: child.key,
            label: child.title.split(':')[0],
            icon: child.icon,
            url: child.path,
            visible: true,
            disabled: false,
          }))
        }

        return item
      }),
    }

    navItems.push(navItem)
  }

  // Add blog section (already grouped properly by parentKey)
  const blogPage = PAGES.find((page) => page.key === 'blog')
  if (blogPage) {
    const blogCategories = PAGES.filter((page) => page.parentKey === 'blog')

    navItems.push({
      key: blogPage.key,
      label: 'Blog',
      icon: blogPage.icon,
      visible: true,
      disabled: false,
      items: [
        {
          key: 'blog-home',
          label: 'All',
          icon: blogPage.icon,
          url: blogPage.path,
          visible: true,
          disabled: false,
        },
        ...blogCategories.map((cat) => ({
          key: cat.key,
          label: cat.title.split(' Articles')[0], // Remove "Articles" suffix
          icon: cat.icon,
          url: cat.path,
          visible: true,
          disabled: false,
        })),
      ],
    })
  }

  return navItems
}

// Build footer navigation automatically
export function getFooterNavigation() {
  return FOOTER_SECTIONS.map((section) => {
    let childPages

    // If section specifies which keys to show, use those
    if (section.showKeys) {
      childPages = section.showKeys
        .map((key) => getPageByKey(key))
        .filter((page): page is PageInfo => page !== undefined)
    } else {
      // Otherwise, get all child pages of this section
      childPages = PAGES.filter((page) => page.parentKey === section.key)
    }

    return {
      key: section.key,
      label: section.label,
      icon: section.icon,
      visible: true,
      disabled: false,
      items: childPages.map((page) => ({
        key: page.key,
        label: page.title.split(':')[0].split(' Articles')[0], // Clean the title
        icon: page.icon || section.icon,
        url: page.path,
        visible: true,
        disabled: false,
      })),
    }
  })
}
