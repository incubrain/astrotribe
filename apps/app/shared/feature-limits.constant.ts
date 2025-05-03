export enum PlanType {
  FREE = 'free',
  PRO = 'pro',
}

export interface FeatureLimit {
  key: string // unique identifier
  display: {
    name: string // simple name without ™
    brandedName: string // name with ™ symbol
    description: string
    tagline?: string // marketing tagline
  }
  limit: {
    [key in PlanType]: number // -1 means unlimited
  }
  benefits: {
    text: string
    icon: string
  }[]
}

export const FEATURES = {
  DISCOVERY: {
    key: 'DISCOVERY',
    display: {
      name: 'Discovery',
      brandedName: 'CosmicPulse™ Observatory',
      description: 'Latest space news and research',
      tagline: 'Access the latest space discoveries and insights',
    },
    limit: {
      [PlanType.FREE]: 12,
      [PlanType.PRO]: -1, // unlimited
    },
    benefits: [
      {
        text: 'Unlimited access to all news articles',
        icon: 'mdi:infinity',
      },
      {
        text: 'Full archive of historical space news',
        icon: 'mdi:archive',
      },
      {
        text: 'Early access to breaking space discoveries',
        icon: 'mdi:rocket-launch',
      },
    ],
  },
  COMPANIES: {
    key: 'COMPANIES',
    display: {
      name: 'Companies',
      brandedName: 'GalaxyGraph™ Enterprise Map',
      description: 'Space industry companies database',
      tagline: 'Access the Definitive Space Industry Database',
    },
    limit: {
      [PlanType.FREE]: 20,
      [PlanType.PRO]: -1,
    },
    benefits: [
      {
        text: 'Full access to all company profiles and details',
        icon: 'mdi:office-building',
      },
      {
        text: 'Comprehensive industry sector mapping',
        icon: 'mdi:map',
      },
      {
        text: 'Strategic competitive intelligence',
        icon: 'mdi:chart-line',
      },
    ],
  },
  JOB_LISTINGS: {
    key: 'JOB_LISTINGS',
    display: {
      name: 'Jobs',
      brandedName: 'ExoTalent™ Network',
      description: 'Space industry career opportunities',
      tagline: 'Access global space industry career opportunities',
    },
    limit: {
      [PlanType.FREE]: 12,
      [PlanType.PRO]: -1,
    },
    benefits: [
      {
        text: 'Unlimited job listings across all space sectors',
        icon: 'mdi:briefcase-search',
      },
      {
        text: 'Early access to new career opportunities',
        icon: 'mdi:clock-fast',
      },
      {
        text: 'Premium positions highlighted',
        icon: 'mdi:star-circle',
      },
    ],
  },
  EVENTS: {
    key: 'EVENTS',
    display: {
      name: 'Events',
      brandedName: 'AstroEncounter™ Calendar',
      description: 'Space industry events and conferences',
      tagline: 'Never miss important space industry events',
    },
    limit: {
      [PlanType.FREE]: 8,
      [PlanType.PRO]: -1,
    },
    benefits: [
      {
        text: 'Complete global astronomy events calendar',
        icon: 'mdi:calendar-star',
      },
      {
        text: 'Personalized event recommendations',
        icon: 'mdi:account-check',
      },
      {
        text: 'Early registration access to premium events',
        icon: 'mdi:ticket-percent',
      },
    ],
  },
  BOOKMARKS: {
    key: 'BOOKMARKS',
    display: {
      name: 'Bookmarks',
      brandedName: 'Bookmarks',
      description: 'Save articles for later',
    },
    limit: {
      [PlanType.FREE]: 50,
      [PlanType.PRO]: -1,
    },
    benefits: [],
  },
  BOOKMARK_FOLDERS: {
    key: 'BOOKMARK_FOLDERS',
    display: {
      name: 'Bookmark Folders',
      brandedName: 'Bookmark Folders',
      description: 'Organize your bookmarks into folders',
    },
    limit: {
      [PlanType.FREE]: 3,
      [PlanType.PRO]: -1,
    },
    benefits: [],
  },
} as const

export type FeatureKey = keyof typeof FEATURES

export const FEATURE_KEY_MAP = Object.fromEntries(
  Object.entries(FEATURES).map(([key, value]) => [value.key, key]),
)

export const FEATURE_KEY_LIST = Object.values(FEATURES).map(
  (feature) => feature.key,
)

export const GLOBAL_BENEFITS = [
  {
    text: 'Ad-free browsing experience',
    icon: 'mdi:eye-off-outline',
  },
  {
    text: 'Priority support',
    icon: 'mdi:headset',
  },
  {
    text: 'Custom alerts and notifications',
    icon: 'mdi:bell-badge',
  },
  {
    text: 'Advanced search filters',
    icon: 'mdi:filter-variant',
  },
  {
    text: 'Early access to new features',
    icon: 'mdi:new-box',
  },
]
