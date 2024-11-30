export const useSocialLinks = () => {
  const socials = [
    {
      id: 1,
      icon: 'mdi:linkedin',
      platform: 'linkedin',
      color: {
        from: 'blue',
        to: 'sky',
      },
      url: 'https://www.linkedin.com/company/astronera',
      username: 'uk',
    },
    {
      id: 2,
      platform: 'twitter',
      icon: 'mdi:twitter',
      color: {
        from: 'sky',
        to: 'blue',
      },
      url: 'https://twitter.com/AstronEra',
      username: 'uk',
    },
    {
      id: 3,
      icon: 'mdi:youtube',
      color: {
        from: 'red',
        to: 'white',
      },
      platform: 'youtube',
      url: 'https://www.youtube.com/astronera',
      username: 'uk',
    },
    {
      id: 4,
      icon: 'mdi:instagram',
      color: {
        from: 'pink',
        to: 'purple',
      },
      platform: 'instagram',
      url: 'https://www.instagram.com/astronera',
      username: 'uk',
    },
  ]

  return {
    socials,
  }
}
