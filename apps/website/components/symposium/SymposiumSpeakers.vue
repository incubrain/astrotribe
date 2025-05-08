<script setup lang="ts">
const speakers = [
  {
    given_name: 'Nalayini',
    surname: 'Brito-Davies',
    professional_title: 'President, Dark Sky International',
    bio: `Nalayini was instrumental in successfully establishing Aotea / Great Barrier Island as a certified Dark Sky Sanctuary.
    She also co-leads the promotion of New Zealand’s journey to become a dark sky nation and has spoken at Dark Sky conferences and workshops around the world.
    She is currently the immediate past president and Fellow of the Royal Astronomical Society of New Zealand (RASNZ) and is a co-founder of the Aotearoa Astrotourism Academy, a non-profit that promotes dark skies and the education of astronomy (integrating indigenous astronomy) through the provision of nationwide immersion training courses for those seeking a solid foundation of knowledge and practical skills to pursue astronomy and astrotourism. `,
    avatar: 'nalayini-bitro-davis',
    featured: true,
  },
  {
    given_name: 'Dan',
    surname: 'Oakley',
    professional_title: 'Director, Darkscape Consulting',
    bio: `Dan Oakley previously worked at BAE-Systems on a number of areas including Torpedo analysis, systems engineering, and radiation safety.
    After a rather liberating experience at the Glastonbury Festival, he changed careers and now works for the South Downs National Park Authority and has done for the last 15 years.
    Starting from a conservation volunteer, he is lead ranger for the Wealden Heaths and the dark skies officer for the park. At the Park, he was instrumental in developing and submitting Moore’s’ Reserve Dark Sky Places application in May 2016.`,
    avatar: 'dan-oakley',
    featured: true,
  },
  {
    given_name: 'Yana',
    surname: 'Yakushina',
    professional_title: 'Policy Analyst and Advocate',
    bio: `Yana is an experienced legal researcher, policy analyst, and advocate for the protection of the nocturnal environment and the advancement of space law.
    Her expertise lies in conducting comprehensive analyses of legal and policy instruments, interpreting obtained data, and delivering clear, valuable conclusions.
    Currently pursuing a Ph.D. at the University of Ghent (Belgium) as part of the Horizon EU PLAN-B project she is  working on the development of the legal and policy framework for recognising light pollution as an environmental concern.
    As a scientific coordinator of the PLAN-B project, she leads the project's efforts towards a better understanding of light and noise pollution impacts and the development of the most effective solutions for their mitigation.`,
    avatar: 'yana-yakushina',
    featured: true,
  },
  {
    given_name: 'Shweta',
    surname: 'Kulkarni',
    professional_title: 'Dark Sky Defender Asia',
    bio: 'Astropreneur Shweta Kulkarni, listed among top 100 women entrepreneurs, spearheads Astronera, marrying business acumen with astronomy for innovative solutions. As a Fellow of the Royal Astronomical Society of England, her venture reflects a novel approach to integrating astronomy with enterprise.',
    abstract: {
      title: 'Skill Training in Astronomy for Income Generation',
      description: `Shweta, the director of AstronEra and CEO of Astron
        SHK Trust, initiated the conference to bridge the link between conserving dark skies and
        sustainable socio-economic development. She introduced herself as an "AstroPreneur,"
        emphasizing her dual roles as a part-time astronomer and full-time entrepreneur. Shweta
        identified key problems including the lack of authentic astronomy knowledge, scientific
        temperament in society, and diminishing dark skies due to light pollution.
        She introduced the "AstroTribe" Project, funded by IAU and OAD, aimed at training tribal
        children in astronomy to empower them economically. This initiative incentivizes students by
        enabling them to generate income through bridging technical astronomy with entertainment
        through astrotourism, thereby promoting awareness about dark skies and addressing SDGs of
        quality education and sustainable economic growth.
        Shweta outlined action points post-conference, focusing on understanding the problem of
        light pollution, identifying target areas and audiences, determining mediums and expected
        outcomes, and establishing frameworks aligned with the human right to dark skies. She
        emphasized leveraging resources available on darksky.org to find solutions and highlighted
        the historical contributions to astronomy, underscoring the responsibility to conserve night
        skies for future generations.
        Following Shweta's talk, a significant event took place where the Astroguide's batch in
        Manali was honored with certificates and recognized for the income they earned from their
        stargazing event. This event served as their graduation ceremony, marking the culmination of
        their training. The Astroguides introduced themselves and shared their experiences gained
        through the training program. They expressed heartfelt gratitude towards the AstronEra team
        for their support and guidance throughout the journey. This ceremony not only celebrated the
        achievements of the Astroguides but also highlighted the impact of empowering individuals
        with astronomical knowledge and skills for economic sustainability in the region.`,
    },
    avatar: 'shweta-kulkarni',
    featured: true,
  },
]

const filterSpeakers = (featured: boolean, toSort = false) => {
  return speakers
    .filter((s: Speaker): boolean | undefined => s.featured === featured)
    .sort((a: Speaker, b: Speaker) => {
      if (!toSort) return 0
      if (a.given_name < b.given_name) {
        return -1
      }
      if (a.given_name > b.given_name) {
        return 1
      }
      return 0
    })
}
</script>

<template>
  <div class="w-full">
    <CommonTitle
      class="col-start-1 full-width"
      :title="{
        main: 'Meet The IDPS Symposium 2025 Speakers',
      }"
    />
    <p class="text-primary-700 text-sm font-bold uppercase pt-4 lg:pt-8"> Speakers </p>
    <div class="pt-4 lg:pt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-8">
      <SymposiumSpeakerCard
        v-for="speaker in filterSpeakers(true)"
        :key="speaker.given_name"
        :speaker="speaker"
        featured
      />
    </div>
  </div>
</template>

<style scoped>
.full-width {
  max-width: 100% !important; /* Forces full-width override */
}
</style>
