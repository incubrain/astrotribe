<template>
  <div class="flex flex-col items-start gap-6 xl:gap-12">
    <CommonTitle
      class="col-start-1 full-width"
      :title="{ main: 'About the Symposium' }"
    >
      <p
        >AstronEra proudly presents India's Dark Sky Policy & Sustainability Symposium, a platform
        dedicated to tackling the critical issue of light pollution. Excessive artificial lighting
        disrupts ecosystems, harms human health, wastes energy, and diminishes cultural and
        astronomical heritage. This event aims to bring together policymakers, lighting companies,
        and global experts to inspire actionable solutions for India, starting with Maharashtra.
      </p>
    </CommonTitle>
    <CommonTitle
      class="col-start-1 full-width"
      :title="{ main: 'Why Attend?' }"
    >
      <ul class="list-disc">
        <li>Understand the ecological, health, and cultural impacts of light pollution.</li>
        <li>Learn from global experts on successful dark sky conservation initiatives.</li>
        <li>Collaborate with policymakers and industries to create sustainable solutions.</li>
        <li>Be a part of drafting policies and frameworks for dark sky policy in India.</li>
      </ul>
      <IBImage
        :img="{
          src: '/symposium/light-pollution-map.jpeg',
          alt: 'https://djlorenz.github.io/astronomy/lp2022/',
        }"
      />
    </CommonTitle>
    <CommonTitle
      class="col-start-1 full-width"
      :title="{ main: 'Objectives' }"
    >
      <ul class="list-disc">
        <li
          >Raise awareness about light pollution and its impacts on nature, humans, and
          astronomy.</li
        >
        <li
          >Inspire pilot projects in rural areas to measure the impact of dark sky conservation
          efforts.</li
        >
        <li
          >Initiate conversations about drafting policies for sustainable urban planning, light
          pollution mitigation, and creation of dark sky reserves.</li
        >
        <li>Highlight dark skies as a fundamental right for every global citizen.</li>
      </ul>
      <div class="flex justify-center gap-2 flex-col md:flex-row">
        <IBImage
          :img="{
            src: 'symposium/before-and-after-germany.jpeg',
            alt: 'https://www.instagram.com/darksky_intl?igsh=MWJqOGV1dGNrbGZ1OQ==',
            width: '500',
            height: '500',
          }"
        />
        <IBImage
          :img="{
            src: 'symposium/before-and-after-wales.jpeg',
            width: '360',
            height: '360',
          }"
        />
      </div>
    </CommonTitle>
    <CommonTitle
      class="col-start-1 full-width"
      :title="{ main: 'Be the Changemaker' }"
    >
      <p
        >This symposium offers a unique opportunity for, policymakers, and lighting companies to
        take a leadership role in combating light pollution. Together, let's create a sustainable
        future by preserving our nightscapes.</p
      >
      <IBImage
        :img="{
          src: 'symposium/five-principals-for-lighting.jpeg',
        }"
      />
    </CommonTitle>
  </div>
</template>

<style scoped>
.full-width {
  max-width: 100% !important; /* Forces full-width override */
}
</style>
