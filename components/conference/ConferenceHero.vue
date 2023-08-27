<template>
  <div>
    <ImageHero
      :img="hero.img"
      :title="hero.title"
      subtitle="24th-26th November 2023"
      object-position="object-bottom"
      fit="cover"
    >
      <NuxtImg
        class="rounded-full overflow-hidden"
        width="160px"
        height="160px"
        src="conference/conference-logo.png"
        alt="Conference logo"
      />
    </ImageHero>
  </div>
</template>

<script setup lang="ts">
const hero = {
  title: 'Dark Sky Conservation India Conference',
  subtitle:
    'We are delighted to unveil the inaugural International Conference on Dark Sky Conservation and Astrotourism, a transformative gathering uniting global experts, enthusiasts, and stakeholders. Hosted by Astronera in partnership with the Department of Science & Technology, Government of India, this landmark event will shed light on the critical need to preserve our pristine night skies and champion sustainable astrotourism practices.',
  img: {
    title: 'Featured image for the Dark Sky Conservation India Conference',
    src: 'conference/shweta-kulkarnin-milkyway-galaxy-manali.jpg',
    alt: 'Featured image for the Dark Sky Conservation India Conference'
  }
}
</script>
