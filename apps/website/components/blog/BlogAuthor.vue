<script setup lang="ts">
const props = defineProps<{
  authorIds: number[]
}>()

const authors = [
  {
    id: 1,
    name: {
      given: 'Shweta',
      surname: 'Kulkarni',
      full: 'Shweta Kulkarni',
    },
    avatar: 'images/team/shweta-kulkarni.jpg',
    bio: {
      short: 'Space Enthusiast',
      full: `Shweta is a space enthusiast and an aspiring astrophysicist.
         She has been closely following the developments in space exploration and has
         been an advocate for the same. She is also a part of the AstronEra team 
         and has been contributing to the blog for a while now.`,
    },
  },
  {
    id: 2,
    name: {
      given: 'Ruchira',
      surname: 'Huchgol',
      full: 'Ruchira Huchgol',
    },
    avatar: 'images/team/ruchira-huchgol.jpg',
    bio: {
      short: 'AstronEra COO',
      full: `
      Ruchira Huchgol is space enthusiasts with a background in Aerospace Engineering. 
      She is also a n Analog Astronaut  and has been involved in  analog space missions.
      `,
    },
    socials: {
      linkedin: 'https://www.linkedin.com/in/ruchira-huchgol-bb114621a/',
    },
  },
  {
    id: 3,
    name: {
      given: 'Srishti',
      surname: 'Bharadwaj',
      full: 'Srishti Bharadwaj',
    },
    avatar: 'images/team/srishti-bharadwaj.jpg',
    bio: {
      short: 'Astroguide & Poet',
      full: `
        Srishti is an astronomy, poetry, and literature enthusiast and a fellow astroguide at Astronera.
        She has been writing poetry and short stories since she was 10, finds peace in stargazing and joy in writing about them.
      `,
    },
    socials: {
      instagram: 'https://www.instagram.com/__srishtispoetry__/',
    },
  },
]

const findAuthors = computed(() => {
  return (
    props.authorIds?.map((id) => authors.find((author) => author.id === id)).filter(Boolean) || []
  )
})
</script>

<template>
  <div>
    <slot :authors="findAuthors" />
  </div>
</template>
