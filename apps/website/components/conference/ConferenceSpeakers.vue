<script setup lang="ts">
import type { SpeakerType } from '@/types/conference'

const hosts = [
  {
    given_name: 'Ruchira',
    surname: 'Huchgol',
    professional_title: 'Organising Committee, Chairman, IDSPAC23 & Operations Manager, AstronEra.',
    bio: `Ruchira Huchgol an analog astronaut with background of
    aerospace engineering has a keen intersted in human space exploration and also works to bring in new opportunities in space sector for the Indian student community
    `,
    avatar: 'ruchira-huchgol',
  },
  {
    given_name: 'Atharva',
    surname: 'Joshi (Jhey)',
    professional_title:
      'Organising Committee, Online Chairman, IDSPAC23 & Project Co-ordinator, AstronEra.',
    bio: `Atharva Joshi is a dedicated architect with extensive experience ranging from the Southern coast to the Himalayas.
    His profound interest in astronomy brings a unique perspective to the innovative projects at AstronEra.`,
    avatar: 'atharva-joshi',
  },
]

const speakers = [
  {
    given_name: 'Sonam',
    surname: 'Wangchuk',
    professional_title: 'Engineer, Innovator and Education Reformist',
    bio: 'Recipient of the Ramon Magsaysay Award, Sonam Wangchuk, an engineer and educator, is lauded for his sustainable development efforts via SECMOL ALTERNATIVE SCHOOL. His innovative approach to environmental and educational challenges showcases a profound commitment to fostering sustainable communities.',
    abstract: {
      title: 'Sustainable Development for Tribal Ladakhies',
      description: `Mr. Sonam Wangchuk, a prominent figure in
        education reform, delivered a keynote speech at the conference, commending the
        AstronEra team's efforts and announcing a collaborative effort between SECMOL,
        HIAL, and AstronEra to safeguard Ladakh's starry skies. He drew parallels between
        Ladakh's rugged terrain and Mars, highlighting its rich cultural diversity.
        Wangchuk stressed the impact of climate change on Ladakh and emphasized the need for
        sustainable living practices to preserve the environment. Introducing SECMOL, an
        innovative school focusing on practical learning and sustainable living, Wangchuk
        emphasized Ladakh's natural sky as a gateway to understanding the universe. He advocated
        for promoting eco-friendly tourism in Ladakh, envisioning it as a pilgrimage site for
        experiencing its majestic landscapes and pristine night skies. Proposing an astrotourism
        campaign to ignite youth interest in astronomy, Wangchuk emphasized the importance of
        conserving Ladakh's dark skies while providing livelihood opportunities. Expressing concern
        over light pollution's effects on wildlife, he highlighted the "I Live Simply" movement,
        urging simplicity to combat climate change's impact.`,
    },
    avatar: 'sonam-wangchuk',
    is_featured: true,
    inPerson: true,
  },
  {
    title: 'Dr.',
    given_name: 'Constance (Connie)',
    surname: 'Walker',
    professional_title:
      "Head of Office of Site Protection, NSF's NOIRLab, USA and Co-Director, IAU CPS",
    bio: "Astronomer Dr. Connie E. Walker is celebrated for her dark skies education advocacy. With a journey sparked by celestial fascinations, she's devoted two decades at NSF's National Optical-Infrared Astronomy Research Lab, crafting global innovative programs. Her academic trail from Physics to a Ph.D. in Astronomy underscores a lifelong dedication to astronomical education.",
    abstract: {
      title:
        'Astronomy and Satellite Constellations: Pathways Forward for Light Pollution from Space',
      description: `Dr. Constance (Connie) Walker, the Head of
        the Office of Site Protection at NSF's NOIRLab, USA, and
        Co-Director of the IAU CPS. Her talk, titled "Astronomy and
        Satellite Constellations: Pathways Forward for Light
        Pollution from Space," highlighted the initiatives and
        programs supported by the International Astronomical
        Union (IAU) to promote and preserve Dark and Quiet Skies.
        Dr. Walker emphasised the challenge posed by satellite constellations to observational
        astronomy and discussed the collaboration of working groups from various fields such as
        engineering, law and policy, pure sciences, astrophysics, and art. She emphasised that the
        field of space and astronomy requires contributions from individuals in every discipline and
        is a common heritage for all.`,
    },
    avatar: 'connie-walker',
    is_featured: true,
    inPerson: false,
  },
  {
    given_name: 'Neethu',
    surname: 'Susan George',
    professional_title: 'MSLL ( Member Society of Light & Lighting ) as well as Dark Sky Advocate',
    bio: `Neethu Susan George, MSLL, WELL AP™, LEED® Green Associate™.
    Designation - Specification Manager Middle East North Africa and India - Lamp Worktitude for Light (Spain) and Griven (Italy)
    MSLL (Member Society of Light and Lighting), DarkSky Advocate, WELL AP™, LEED® Green Associate™.
    Graduate in Electrical and Electronics Engineering from Mahatma Gandhi University, and MSc. Energy with dissertation on Light Pollution and Circularity in Lighting from Heriot-Watt University

    `,
    abstract: {
      title: 'Lighting for Dark Skies',
      description: `Mrs. Neethu Susan George, a member of
        the Society of Light & Lighting (MSLL) and a Dark Sky Advocate, presented
        "Lighting for Dark Skies," focusing on fundamental strategies to combat light
        pollution. She advocated for installing motion sensors or timers to regulate light
        usage efficiently and advocated for the adoption of lower-intensity lighting to
        minimize unnecessary illumination. Mrs. George emphasized the importance of
        properly aiming and shielding outdoor lights to prevent glare, light spill, and
        skyglow. Additionally, she recommended the implementation of louvers, baffles, or shields to
        direct light where needed and prevent it from dispersing into the sky or neighboring areas. To
        further mitigate light pollution, she suggested the use of curtains or blinds indoors to contain
        light within the premises, thus safeguarding the night environment from artificial light intrusion.
        
        Ms. George emphasized the importance of educating oneself and the community about the
        impacts of light pollution on the environment, human health, and astronomical observations.
        She encouraged support for organizations like the International Dark-sky Association (IDA),
        which actively promotes responsible outdoor lighting and the preservation of dark skies.
        Additionally, Ms. George advocated for increased involvement from stakeholders,
        companies, and government bodies to engage in discussions and collaborate on
        implementable solutions to address the issue of light pollution.`,
    },
    avatar: 'neethu-george',
    is_featured: false,
    inPerson: true,
  },
  {
    given_name: 'Bhakti',
    surname: 'Mithagri',
    professional_title: 'MSc Astrophysics',
    bio: "Curious learner and astronomy enthusiast. Graduated with a Master's degree in Astrophysics from St. Xavier's College in Mumbai and currently preparing for Ph.D.",
    abstract: {
      title: 'Indian successors to the Indian Gamma-Ray Observatory(IGRO) Mission',
      description: `Ms. Bhakti Mithagri, an MSc Astrophysics graduate and avid astronomy
        enthusiast, delivered a presentation titled "Indian Successors to the Indian Gamma-Ray
        Observatory (IGRO) Mission." Alongside her colleague Mr. Kshititj Pawar, they elucidated
        an indigenous alternative mission concept in its initial stages. The presentation also addressed
        the issue of insufficient data democratisation within the research domain, particularly for
        students and young researchers.`,
    },
    avatar: 'bhakti-mithagri',
    is_featured: false,
    inPerson: true,
  },
  {
    title: 'Dr.',
    given_name: 'Anita',
    surname: 'Gupta',
    professional_title: 'Adviser/Scientist G at DST, Govt. of India',
    bio: "Dr. Anita Gupta, an Adviser/Scientist G at India's DST, has over 25 years of experience in innovation, entrepreneurship, and start-ups. As Associate Head of Innovation and Entrepreneurship, she leads initiatives like Startup India, fostering over 150 technology business incubators across premier institutes and engaging in Public-Private Partnerships with major MNCs to enhance India's innovation landscape.",
    abstract: {
      title: "Harnessing India's  potential to fight Climate Change",
      description: `Dr. Anita Gupta. Representing the Climate Change & Clean Energy (C3E) Division within
        the Department of Science and Technology, Government of India, Dr.
        Gupta underscored the government's cognizance of pressing concerns such
        as light pollution and its adverse effects on astronomy. She emphasized
        the readiness of governmental entities to engage in collaborative endeavors with
        organizations, corporations, and non-governmental organizations (NGOs) to explore
        alternative strategies and foster the adoption of clean energy practices and sustainable
        initiatives.`,
    },
    avatar: 'anita-gupta',
    is_featured: true,
    inPerson: false,
  },
  {
    given_name: 'Maria',
    surname: 'Alejandra Díaz',
    professional_title: 'Astronomer',
    bio: `Alejandra, with a Physics degree from UAM, Spain, has worked at the European Space Agency and is pursuing a PhD in Turku.
    Passionate about astronomy's societal impact, she's contributed to IAU's OAD projects and operates a telescope in La Palma alongside her thesis.`,
    abstract: {
      title: "Astronomy's Impact on Sustainability",
      description: `Maria Alejandra Díaz is an astronomer with a Physics degree from UAM, Spain, and is
        pursuing a PhD in Turku. Passionate about astronomy's societal impact, she's contributed to
        IAU's OAD projects and operates a telescope in La Palma alongside her thesis. Her talk was
        titled Astronomy's Impact on Sustainability. In her talk, she gave a very brief overview of the
        various 200 projects funded by the IAU OAD and how these projects highlighted exactly the
        definition of sustainability and the harmony that it helps to maintain between economy,
        society and environment. She highlighted how these projects evolved in following Goal 4:
        quality education, Goal 8: Decent work and economic growth, Goal 5: gender equality, Goal
        10: Reduced Inequality, and Goal 11: affordable clean energy. She also mentioned case
        studies that highlighted astronomy and its impact and relation with mental health,
        socio-economic development and preserving indigenous roots and knowledge of the night sky.`,
    },
    avatar: 'maria-alejandra-diaz',
    is_featured: false,
    inPerson: false,
  },
  {
    title: 'Dr.',
    given_name: 'Priya',
    surname: 'Hasan',
    professional_title: 'Dr. of Astrophysics and Physics',
    bio: `Dr. Priya Hasan, from Moscow State and Osmania University, is an acclaimed astrophysicist. Awarded as Women Scientist by the Department of Science & Technology,
    she's lectured at CalTech and Harvard. Currently at Maulana Azad University, she co-chairs the IAU's Women in Astronomy and champions science outreac`,
    abstract: {
      title: 'Dark Skies and Bright Satellites',
      description: `Dr. Priya Hasan, a distinguished astrophysicist
        and co-chair of the International Astronomical
        Union's Women in Astronomy, delivered a presentation titled "Dark Skies and Bright
        Satellites." Dr. Hasan highlighted the disruptive impact of the launch of numerous satellites on
        astronomical observations, particularly during twilight after dawn and dusk. She elucidated
        that the brightness of satellites depends on various factors, including inclination, altitude,
        attitude, orbital position, wavelength, and time of the year. Focusing on the Vera Rubin Observatory (LSST), which scans the skies for
        transients and near-Earth objects, Dr. Hasan discussed the adverse effects of satellite trails in
        science images. These effects encompass the loss of information on pixels, cross-talk in
        electronics, ghost images, and residual images, varying depending on the telescope and
        detector used. Furthermore, Dr. Hasan addressed potential solutions and mitigation strategies, referencing
        the SATCON1 report. These strategies include reducing reflectivity through the application of
        dark paint, redirecting light away, deploying fewer satellites to minimize the issue, designing
        smaller satellites to mitigate their impact, and ensuring predictability to facilitate scheduled observations
        `,
    },
    avatar: 'priya-hasan',
    inPerson: false,
    is_featured: true,
  },
  {
    given_name: 'Vedvrat',
    surname: 'Vinayak Bedekar',
    professional_title: 'BE IT Student',
    bio: 'An amateur astronomer running an astronomy club in college. Frequent stargazer and host of stargazing events. ',
    abstract: {
      title: 'Light pollution: A Camouflaging pollution',
      description: `Mr. Vedvrat Vinayak Bedekar, a BE IT student and amateur astronomer overseeing an
        astronomy club in college, presented insights as one of the youngest speakers. His talk
        centred around the proposal to include a new category, 'Average Light Pollution,' in the daily
        regional weather report to raise awareness about the severity of light pollution. He further
        suggested the observance of a designated day, 'Dark Sky Preservation Day,' during which
        residents of villages and cities would turn off their lights temporarily to observe, enjoy, study,
        and appreciate the beauty of the universe. Additionally, he advocated for the initiation of a
        nationwide movement called 'Dark Sky Preservation Mission,' similar to the 'Swachh Bharat
        Mission.' This initiative would recognize and award villages and cities making exemplary
        efforts to raise awareness and reduce light pollution with a unique 'Dark Sky Preservation
        Award' at both state and national levels.
        `,
    },
    avatar: 'vedvrat-bedekar',
    is_featured: false,
    inPerson: false,
  },
  {
    given_name: 'David',
    surname: 'Ault',
    professional_title: 'Director of Education For Immersive Experiences',
    bio: `David is the Director of Education for Immersive Experiences, a UK planetarium and interactives company with a global footprint.
    With an astrophysics degree from Cambridge University, he entered the planetarium space in 2006, organising science festivals and starting a number of astronomy podcasts.`,
    abstract: {
      title: 'The planetarium as a creative space',
      description: `David Ault, the Director of Education for Immersive
        Experiences, a UK-based planetarium and interactives
        company, adeptly showcased the use of domes as an
        interactive tool for educating intricate concepts in
        astronomy. Through collaborative discussions,
        plans were formulated to deploy these inflatable
        portable domes in schools and remote areas, creating a mobile planetarium.
        This initiative aims to reinstate and enhance
        outreach efforts in the field of astronomy.
        `,
    },
    avatar: 'david-ault',
    is_featured: false,
    inPerson: false,
  },
  {
    given_name: 'Samyukta',
    surname: 'Manikumar',
    professional_title: 'Astrotourism Consultant',
    bio: `Samyukta, director of Noctia Institute, champions dark sky conservation through astrotourism. Blending science with cultural preservation,
    she's a fellow at the International Astronomical Union, focusing on rural astrotourism resources via the 'Socio-economic development through Astronomy Flagship'.`,
    abstract: {
      title: 'Harnessing Dark Skies for Socioeconomic Development in Rural Areas',
      description: `Ms. Samyukta Manikumar,
        an Astro Tourism consultant and fellow at the
        International Astronomical Union, presented on the
        topic "Harnessing Dark Skies for Socioeconomic
        Development in Rural Areas." She highlighted the
        immense potential of astro tourism in involving,
        educating, and uplifting rural populations. Ms Manikumar emphasized that rural areas still
        have the privilege of having dark skies, which can be leveraged by tourism companies
        through collaborations with the rural population. This, in turn, can help improve the social
        and economic conditions of these areas.
        `,
    },
    avatar: 'samyukta-manikumar',
    inPerson: false,
    is_featured: true,
  },
  {
    given_name: 'Upasana',
    surname: 'Dasgupta',
    professional_title:
      'Postdoctoral Researcher at Canada Research Chair in International Political Economy of Université Laval ',
    bio: `Upasana Dasgupta researches space policies at Université Laval and is on ACES Worldwide's board. With a Doctorate from McGill,
    she's an expert in space law, associated with global space entities, and emphasizes on space collision prevention and dark sky conservation.`,
    avatar: 'upasana-dasgupta',
    abstract: {
      title: 'Intruders in the Dark Sky: The Megaconstellation Crisiss',
      description: ` Ms. Upasana Dasgupta, a Postdoctoral Researcher at the Canada Research Chair in
        International Political Economy of Université Laval, presented "Intruders in the Dark Sky:
        The Mega Constellation Crisis." She outlined the current space policy framework, including
        the Outer Space Treaty, liability convention, and Moon agreement. Ms. Dasgupta highlighted
        the absence of dedicated regulations for satellite constellations and debris, underscoring their
        disruptive impact on observational astronomy by introducing additional noise into datasets,
        hindering scientific research.
        `,
    },
    is_featured: false,
    inPerson: true,
  },
  {
    given_name: 'Dinesh',
    surname: 'Nisang',
    professional_title: 'Science Communicator',
    bio: `Dinesh founded Sunday Science School and is passionate about science communication. An astronomer, he views astronomy as a unifier for humanity.
    He enjoys astrophotography, exploring nature, and is an aspiring writer with articles and a book on scientific innovation. Focus: ISAAC.`,
    abstract: {
      title: 'Stellar Education: Unveiling ISAAC',
      description: `Mr. Dinesh Nisang, Science Communicator and founder of Sunday Science School shared
        his talk “Stellar Education: Unveiling Interactive Space and Astronomy Activity Centre”
        (ISAAC). His entire conversation was focused on how astronomy deserves and hands on
        approach to improve and enhance better understanding the concepts. He demonstrated very
        well by showing the kits of innovative models, one of them was a GMRT telescope which
        helped understand the engineering aspect as well as the working of the observatory. His talk
        very well complemented the tone of the day's inclusion of astronomy and space science in the
        educational curriculum.
        `,
    },
    avatar: 'dinesh-nisang',
    is_featured: false,
    inPerson: true,
  },
  {
    given_name: 'Exodus',
    surname: 'Chun-Long Sit',
    professional_title: 'Transmedia Astronomy Educator',
    bio: `Exodus CL Sit from Hong Kong is a transmedia astronomy educator and science author.
    He holds roles in IAU as the National Astronomy Education Coordinator for Hong Kong and Co-Outreach Coordinator.
    A member of the Dark Sky International Committee, he champions dark-sky protection, STEAM education, and interdisciplinary science approaches.`,
    abstract: {
      title: 'ASTROx Dark Sky: How to Integrate Astronomy Education into Interactive Classroom',
      description: `Exodus Chun-Long Sit addressed
        the integration of astronomy education in an interactive
        classroom and the escalating issue of light pollution, proposing a DIY
        light shielding solution. He also explored the interconnectedness of
        entrepreneurship and space arts with astronomy. Additionally, he
        advocated for biodiversity conservation, suggesting the
        establishment of Dark Sky Parks. Mr. Sit emphasized the IDEAS
        framework, encompassing Immersivity, Diversity, Equity, Access, and Spreading awareness, as a strategy for advancing
        astronomy education and outreach efforts.
        `,
    },
    avatar: 'exodus-chun-long-sit',
    is_featured: false,
    inPerson: false,
  },
  {
    given_name: 'Nadia Makhijani',
    surname: '& Udish Sharma',
    professional_title: 'BSc. Physics Students',
    bio: `We are pursuing BSc Physics hons from St. Stephen's College, University of Delhi and have mainly worked in radio astronomy,
    its applications and Cosmology. Nadia Makhijani and Udish Sharma are students in their final year at St. Stephen's College pursuing a course in physics.
    They work in the fields of Astronomy and Cosmology and are currently involved in setting up a Radio Astronomy Laboratory in their institution.
    They are also currently in the student led physics and astronomy society.`,
    avatar: 'nadia-makhijani',
    abstract: {
      title: 'Affordable Radio Astronomy Lab',
      description: `Ms. Nadia Makhijani and Mr. Udish Sharma, both BSc Physics students with a primary focus
        on radio astronomy, its applications, and cosmology, presented a talk titled "Affordable Radio
        Astronomy Lab." During their presentation, they introduced an economically viable radio
        telescope – a pyramidal horn – that was constructed in-house using low-cost equipment. This
        telescope is designed for use in college laboratories and outreach programs, providing an
        accessible platform for students. The duo utilized the horn antenna for a Radio Frequency
        Interference (RFI) survey of their campus, observed the H-21 emission from our galaxy, and
        plotted the rotation curve. They also highlighted the versatility of this affordable setup for
        various experiments in college laboratories, such as satellite and meteor tracking, receiving
        weather images, and collecting GPS data. The objective of their presentation was to
        emphasize how cost-effective experiments can be implemented in undergraduate labs.
        `,
    },
    is_featured: false,
    inPerson: false,
  },
  {
    title: 'Dr.',
    given_name: 'Kiran',
    surname: 'Kulkarni',
    professional_title: 'Indian Administrative Service Officer',
    bio: "Dr. Kulkarni has significantly contributed to tribal development, notably as Tribal Development Commissioner. While his work doesn't directly involve astronomy, his extensive outreach in education and governance innovations hints at a potential for fostering astronomy-related initiatives within tribal communities. His campaigns like Dream Melghat showcase his commitment to community upliftment, possibly providing a platform for intertwining traditional tribal knowledge with astronomical insights.",
    abstract: {
      title: 'Sustainable Development through Astronomy: A Tribal Perspective',
      description: `Dr. Kiran Kulkarni (IAS), former Commissioner of the
        Tribal Development Department, Gov. of Maharashtra. While Dr. Kulkarni's primary
        professional focus may not directly involve astronomy, his extensive involvement in
        education and governance innovations suggests potential avenues for fostering
        astronomy-related initiatives within tribal communities. His talk was titled
        "Sustainable Development through Astronomy: A Tribal Perspective."
        During his presentation, Dr. Kulkarni drew attention to the critical distinctions
        between tribal and rural communities. He prompted contemplation on the unique
        characteristics of the locations inhabited by tribal populations, characterized by their remoteness, isolation, and freedom from the
        impact of pollution, including light pollution. Dr. Kulkarni suggested that these remote and
        quiet locations might be ideal for establishing dark skies, encouraging further assessment and
        consideration for similar initiatives.
        `,
    },
    avatar: 'kiran-kulkarni',
    is_featured: true,
    inPerson: true,
  },
  {
    given_name: 'Amshu',
    surname: 'CR',
    professional_title: 'Entrepreneur, Thapasu foods LLP',
    bio: 'Forest value chains, Land degradation, Biodynamic Agriculture, Tribal produce supply chains, Food security, knowledge preservation, Sustainablity ',
    abstract: {
      title: 'The ancient science of space and agriculture for sustainability and harmony',
      description: `Amshu CR, an entrepreneur from Thapasu Foods LLP, presented on "The
        Ancient Science of Space and Agriculture for Sustainability and Harmony." She effectively
        explained the significance of Vedic knowledge in assessing the night skies based on seasons
        and how this knowledge can be applied to enhance agricultural conditions. Emphasizing the
        revision and implementation of this ancient approach in the form of Biodynamic farming,
        Amshu CR left the audience with thought-provoking insights. The presentation highlighted
        how actual sky observations, in addition to satellite imagery and mapping, can assist farmers
        in optimizing their agricultural practices.
        `,
    },
    avatar: 'amshu-cr',
    is_featured: false,
    inPerson: false,
  },
  {
    given_name: 'Albert',
    surname: 'Kuntu Forson',
    professional_title: 'PhD Research Student',
    bio: 'Albert, an engineer specializing in Radio Astronomy Instrumentation and radio interferometer designs at the University of Mauritius, holds the esteemed role of IAU-OAD National Astronomy Education Coordinator for Ghana. Additionally, he serves as the President for PRAGSAC and is highly enthusiastic about science communication.',
    abstract: {
      title:
        "Empowering Ghana's STEM Education: Bridging the Gap through Capacity Building in Astronomy Instrumentation",
      description: `Mr. Albert Kuntu Forson, a Ph.D. Research Student and
        the IAU-OAD National Astronomy Education Coordinator for Ghana,
        presented on "Empowering Ghana's STEM Education: Bridging the Gap
        through Capacity Building in Astronomy Instrumentation." Mr.
        Forson emphasized Africa's growing presence in the field of space sciences
        and discussed initiatives such as the AtroPhy project. This project serves
        as a catalyst for graduate and undergraduate students, offering hands-on experience in radio telescope engineering and
        operational techniques. Utilizing the Table Top Radio Telescope (TTRT) for Galactic
        Hydrogen Emission (HI) studies and developing small parabolic dish antennas, AtroPhy
        contributes significantly to addressing socio-economic challenges, including poverty, hunger,
        and illegal mining in Ghana. By nurturing practical skills, fostering scientific curiosity, and
        promoting collaboration, AtroPhy plays a pivotal role in advancing STEM education and
        capacity building in the region.
        `,
    },
    avatar: 'albert-forson',
    is_featured: false,
    inPerson: false,
  },
  {
    given_name: 'Aishwarya',
    surname: 'Khade',
    professional_title: 'Mental Health Practitioner / Expressive Arts ',
    bio: 'A seasoned Psychologist and Mental Health Professional, Aishwarya Khade employs art and movement-based facilitation in educational and corporate settings. Specialized in corporate wellness, her drive is to enhance mental health and well-being through innovative methodologies.',
    abstract: {
      title: 'Mental Health Arts and Astronomy',
      description: `The final presentation of the day addressed the intersection of Mental Health, Arts, and
        Astronomy, delivered by Ms. Aishwarya Khade, a seasoned Psychologist and Mental Health
        Professional. Ms. Khade employs art and movement-based facilitation techniques in both
        educational and corporate settings. She provided a detailed account of her experiences while
        collaborating with the AstoTribe project in Nashik in 2022 and Ladakh in 2023. Ms Khade
        emphasized her work with tribal children who were undergoing training to become Astro
        guides. The incorporation of artistic elements proved instrumental in creating a comfortable
        environment, allowing the children to share their indigenous tribal stories related to
        constellations. This approach also facilitated discussions about the beliefs and superstitions
        prevalent in their respective tribal communities.
        `,
    },
    avatar: 'aishwarya-khade',
    is_featured: false,
    inPerson: true,
  },
  {
    given_name: 'Hosein',
    surname: 'Khezri',
    professional_title: 'Associate of Commission C1 WG Astronomy Education Research & Methods',
    bio: 'Affiliated with multiple astronomical unions including the IAU, Hosein Khezri is dedicated to elevating astronomy education and its cultural integration. His association with the Iranian Teachers Astronomy Union and various International Astronomical Union commissions reflects a broad engagement in promoting astronomy in diverse cultural landscapes.',
    abstract: {
      title: 'Road to Sky',
      description: 'Cancelled due to technical issues',
    },
    avatar: 'hossein-khezri',
    is_featured: false,
    inPerson: false,
  },
  {
    given_name: 'Shweta',
    surname: 'Kulkarni',
    professional_title: 'Founder/Director of AstronEra',
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
    is_featured: true,
    inPerson: true,
  },
] as SpeakerType[]

const filterSpeakers = (is_featured: boolean, toSort = false) => {
  return speakers
    .filter((s: Speaker): boolean | undefined => s.is_featured === is_featured)
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
      :title="{
        main: 'Meet The IDSPC2023 Group',
      }"
    />
    <p class="text-primary-700 text-sm font-bold uppercase"> offline / online Chairperson </p>
    <ConferenceChairperson
      class="pt-6"
      :hosts="hosts"
    />
    <p class="text-primary-700 text-sm font-bold uppercase pt-4 lg:pt-8"> Conference Speakers </p>
    <div class="pt-4 lg:pt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-8">
      <ConferenceSpeakerCard
        v-for="speaker in filterSpeakers(true)"
        :key="speaker.given_name"
        :speaker="speaker"
        is-featured
      />
      <ConferenceSpeakerCard
        v-for="speaker in filterSpeakers(false, true)"
        :key="speaker.given_name"
        :speaker="speaker"
      />
    </div>
  </div>
</template>

<style scoped></style>
