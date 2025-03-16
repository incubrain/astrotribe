export function useBlogCategories() {
  const categories = {
    'all': {
      title: 'AstronEra Blog',
      description: 'Discover all our articles spanning the wonders and advancements of space.',
      image: 'images/blog/all/isro-rocket-launch.png',
    },
    'people-of-space': {
      title: 'People of Space',
      description: 'Meet the trailblazers and visionaries propelling humanity into the cosmos.',
      image: 'images/blog/people-of-space/people-of-space.webp',
    },
    'space-exploration': {
      title: 'Space Exploration',
      description:
        'Embark on thrilling journeys through our latest missions and cosmic discoveries.',
      image: 'images/blog/space-exploration/1.starship-lands-on-mars.webp',
    },
    'dark-sky-conservation': {
      title: 'Dark Sky Conservation',
      description: 'Uncover efforts to preserve our celestial vistas and protect night skies.',
      image:
        'images/blog/dark-sky-conservation/1.landscape-painting-of-dark-skies-and-mountains.webp',
    },
    'sustainable-development': {
      title: 'Sustainable Development',
      description: 'Explore innovations for a sustainable future in space and on Earth.',
      image: 'images/blog/sustainable-development/1.sustainable-global-space-development.webp',
    },
  }

  const getCategoryInfo = (slug: string) => categories[slug] || categories.all

  const getCategoryImage = (slug: string) => {
    return getCategoryInfo(slug).image
  }

  const validCategories = Object.keys(categories)

  return {
    categories,
    getCategoryInfo,
    getCategoryImage,
    validCategories,
  }
}
