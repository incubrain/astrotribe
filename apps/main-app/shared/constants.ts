export const FEATURES = {
  BOOKMARK_FOLDERS: {
    name: 'Bookmark Folders',
    limit: {
      free: 2,
      pro: -1, // unlimited
    },
    description: 'Organize your bookmarks into folders',
  },
  BOOKMARKS: {
    name: 'Bookmarks',
    limit: {
      free: 100,
      pro: -1,
    },
    description: 'Save articles for later',
  },
  CUSTOM_FOLDER_COLORS: {
    name: 'Custom Folder Colors',
    limit: {
      free: 0,
      pro: -1,
    },
    description: 'Personalize your folders with custom colors',
    comingSoon: true,
  },
} as const