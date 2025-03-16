export const blogCategories = [
  { slug: 'all', label: 'All' },
  { slug: 'dark-sky-conservation', label: 'Conservation' },
  { slug: 'people-of-space', label: 'People' },
  { slug: 'space-exploration', label: 'Exploration' },
  { slug: 'sustainable-development', label: 'Sustainability' },
]

export const navigationLinks = [
  // Other nav items...
  {
    key: 'blog',
    label: 'Blog',
    icon: 'material-symbols:menu-book-outline',
    visible: true,
    disabled: false,
    items: blogCategories.map((category) => ({
      key: `blog-${category.slug}`,
      label: category.label,
      icon: 'material-symbols:menu-book-outline',
      url: `/blog/category/${category.slug}`,
      visible: true,
      disabled: false,
    })),
  },
  // Other nav items...
]

export const footerLinks = [
  // Other footer sections...
  {
    key: 'blog',
    label: 'Blog',
    icon: 'material-symbols:menu-book-outline',
    visible: true,
    disabled: false,
    items: blogCategories.map((category) => ({
      key: `blog-${category.slug}`,
      label: category.label,
      icon: 'material-symbols:menu-book-outline',
      url: `/blog/category/${category.slug}`,
      visible: true,
      disabled: false,
    })),
  },
  // Other footer sections...
]
