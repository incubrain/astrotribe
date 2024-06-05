<script setup lang="ts">
defineProps<{
  authorId: number
}>()

const authors = [
  {
    id: 1,
    name: {
      given: 'Shweta',
      surname: 'Kulkarni',
      full: 'Shweta Kulkarni'
    },
    avatar: 'images/team/shweta-kulkarni.jpg',
    bio: {
      short: 'Space Enthusiast',
      full: `Shweta is a space enthusiast and an aspiring astrophysicist.
         She has been closely following the developments in space exploration and has
         been an advocate for the same. She is also a part of the AstronEra team 
         and has been contributing to the blog for a while now.`
    }
  },
  {
    id: 2,
    name: {
      given: 'Srishti',
      surname: 'Bharadwaj',
      full: 'Srishti Bharadwaj'
    },
    avatar: 'images/team/srishti-bharadwaj.jpg',
    bio: {
      short: 'Astroguide & Poet',
      full: `
        Srishti is an astronomy, poetry, and literature enthusiast and a fellow astroguide at Astronera.
        She has been writing poetry and short stories since she was 10, finds peace in stargazing and joy in writing about them.
      `
    }
  }
]

const findAuthor = (id: number) => {
  return authors.find((author) => author.id === id)
}
</script>

<template>
  <div>
    <slot :author="findAuthor(authorId)"></slot>
  </div>
</template>
