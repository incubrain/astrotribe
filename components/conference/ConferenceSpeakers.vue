<template>
  <div class="w-full">
    <CommonTitle
      :title="{
        label: 'Conference Speakers',
        main: 'Experts From All Around The Globe'
      }"
    />
    <ConferenceChairperson
      class="pt-6"
      :speaker="chairman"
    />
    <div class="pt-4 lg:pt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-8">
      <LazyConferenceSpeakerCard
        v-for="speaker in filterSpeakers(true)"
        :key="speaker.given_name"
        :speaker="speaker"
        featured
      />
      <LazyConferenceSpeakerCard
        v-for="speaker in filterSpeakers(false, true)"
        :key="speaker.given_name"
        :speaker="speaker"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SpeakerType } from '@/types/conference'

const chairman = {
  given_name: 'Ruchira',
  surname: 'Huchgol',
  professional_title: 'Organising Committee, Chairman, IDSPAC23 & Operations Manager, AstronEra.',
  bio: `Ruchira Huchgol an analog astronaut with background of
    aerospace engineering has a keen intersted in human space exploration and also works to bring in new opportunities in space sector for the Indian student community
    `,
  avatar: 'ruchira-huchgol'
}

const speakers = [
  {
    given_name: 'Sonam',
    surname: 'Wangchuk',
    professional_title: 'Engineer, Innovator and Education Reformist',
    bio: 'Recipient of the Ramon Magsaysay Award, Sonam Wangchuk, an engineer and educator, is lauded for his sustainable development efforts via SECMOL ALTERNATIVE SCHOOL. His innovative approach to environmental and educational challenges showcases a profound commitment to fostering sustainable communities.',
    abstract: {
      title: 'Sustainable Development for Tribal Ladakhies',
      description: ''
    },
    avatar: 'sonam-wangchuk',
    featured: true,
    inPerson: true
  },
  {
    title: 'Dr.',
    given_name: 'Constance (Connie)',
    surname: 'Walker',
    professional_title:
      "Head of Office of Site Protection, NSF's NOIRLab, USA and Co-Director, IAU CPS",
    bio: "Astronomer Dr. Connie E. Walker is celebrated for her dark skies education advocacy. With a journey sparked by celestial fascinations, she's devoted two decades at NSF's National Optical-Infrared Astronomy Research Lab, crafting global innovative programs. Her academic trail from Physics to a Ph.D. in Astronomy underscores a lifelong dedication to astronomical education.",
    abstract: {
      title: 'Light Pollution and Satellite Constellations',
      description: `While broadband communications enabled by satellite constellations can be beneficial,
      they pose a significant challenge to existing and upcoming astronomical infrastructures. Surfaces of these satellites are often made of highly reflective metal,
      and reflections from the Sun can be detrimental to the sensitive capabilities of large astronomical telescopes, including wide-angle survey telescopes under construction. In addition, astronomical observations at radio wavelengths are threatened through radio leaks.
      The launching of the first constellation of Starlink satellites by SpaceX in May 2019 set into motion an organized response by astronomers worldwide in terms
      of four conferences in 2020 and 2021 (SATCON1 & 2 and Dark & Quiet Skies or D&QS1 & 2). The recommendations on mitigations that came out of these conferences are
      being pursued by "Hub" members of the IAU Center for the Protection of the Dark and Quiet Sky from Satellite Constellation Interference (IAU CPS), founded in April 2022.
      The IAU CPS consists of four "Hubs": SatHub (software and observations); Policy; Industry & Technology (I&T) and Community Engagement (CE).
      The high level goals of these Hubs are 1) to pursue the ongoing impact of large satellite constellations on ground- and space-based astronomical activities at optical
      and radio wavelengths; 2) to engage with satellite industry operators and to discuss present and future mitigation efforts (I&T Hub) 3) to discuss the mitigation
      measures/techniques planned/implemented by telescope facilities (SatHub); 4) to discuss potential developments in policy and in the regulatory framework
      for large satellite constellations (Policy Hub); and to discuss strategies for informing and engaging with the wider community of night-sky stakeholders impacted
      by large satellite constellations (CE Hub) Come hear about all of the work that has taken place in the last year and a half by the more than 250 members of the IAU CPS
      in quantifying information on the impact of satellite constellations on the field of astronomy. `
    },
    avatar: 'connie-walker',
    featured: true,
    inPerson: false
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
      description: `We talk about human-centric lighting and well-being solutions for indoor spaces. We discuss air pollution, water pollution, and noise pollution. But, light pollution or the impacts of artificial lighting on the ecosystem is often overlooked.
      The effort to mitigate light pollution at a macro level (in a community, a city, or a country) must begin at the micro level (one's own premises). Most of the general public worldwide, including key decision-makers are unaware of light pollution. The term light pollution shouldn’t be a term for the technically savvy, but rather a common term for everyone.
      Light pollution is rising by 2% annually, and almost 80% of the global population lives under light pollution. Rather than lighting up what is intended to be lit up, it turns the night skies brighter and limits the visibility of celestial bodies. Particulate matter suspended in the air (air pollution) further increases light scattering at night. 
      This paper imparts knowledge and guidance to the common man, in analyzing outdoor lighting and making feasible and practical changes, to make the environment a safe place both for humanity, and the ecosystem.
      Light pollution and its components – backlight, uplight, and glare (BUG) are explained. Light trespass due to backlight and light spill, skyglow due to uplight, and veiling luminance due to glare are analyzed with real-life images that demonstrate the consequences of overlighting, as we often link lighting to safety when lighting up an exterior space.
      The Bortle scale is explained along with the interactive Light Pollution Map recommended by DarkSky International.
      The visual and non-visual impact of light pollution on flora (plants) and fauna (migratory birds, turtles, and bats) are studied along with its impact on humanity.
      The ten core principles for external illumination to mitigate light pollution by following Responsible Outdoor Lighting at Night (ROLAN) manifesto for lighting, and thereby supporting the United Nations sustainable development goals is addressed.
      The intent of the Sustainable Sites Credit - Light Pollution Reduction, and the different paths each rating system (LEED BD+C and LEED O+M) follows to mitigate light pollution based on the lighting zones the project falls under are addressed.
      The concept of a circular economy is also explained in brief to reduce the accumulation of discarded luminaires, and the associated stress on the supply chain.
      Using the Five Principles of Responsible Outdoor Lighting by DarkSky and Illuminating Engineering Society (IES) in ROLAN, an ordinary person will be able to choose the right luminaire for a common application by educating the public, raising awareness, and changing perceptions. Any installation that incorporates these principles will save energy and money, reduce light pollution, minimize wildlife disruption, and mitigate climate change.
      Rather than depending solely on a public ordinance for a nation, or a contractor, a lighting designer, or a consultant for a building or a neighborhood, if every citizen is aware of the consequences and the steps they can take to resolve light pollution, it will be faster and easier to reduce and minimize light pollution.`
    },
    avatar: 'neethu-george',
    featured: false,
    inPerson: true
  },
  {
    given_name: 'Bhakti',
    surname: 'Mithagri',
    professional_title: 'MSc Astrophysics',
    bio: "Curious learner and astronomy enthusiast. Graduated with a Master's degree in Astrophysics from St. Xavier's College in Mumbai and currently preparing for Ph.D.",
    abstract: {
      title: 'Indian successors to the Indian Gamma-Ray Observatory(IGRO) Mission',
      description: `We are proposing the development of a MeV (Mega-electronvolt) gamma-ray telescope to augment India's observation capabilities across
      the electromagnetic spectrum. India has a track record of deploying sophisticated instruments across various electromagnetic wavelengths,
      such as the GMRT (Giant Metrewave Radio Telescope) for radio waves, the HCT (Himalayan Chandra Telescope) for optical-infrared, and the Astrosat for X-rays.
      Additionally, India operates HAGAR and MACE facilities for very high-energy observations, contributing significantly to the study of distant galaxies,
      active galaxies, and high-energy transients. However, a critical observational gap exists in the MeV gamma-ray range,
      which lies between the energy coverage of Astrosat (ranging from 0.3 keV to 0.1 MeV) and MACE (ranging from 20 to 100 GeV).
      Previously, the Compton gamma-ray telescope operated in the 20 keV to 30 GeV range but is no longer operational.
      It was succeeded by ASI AGILE (30 MeV-30 GeV) and NASA Fermi (20 MeV-300 GeV), both of which have exceeded their expected mission durations.
      The proposed MeV gamma-ray telescope will function within the energy range of approximately 0.2 MeV to 20 GeV and will be equipped with cutting-edge
      instruments for measuring Compton scattering and pair production. These instruments will be an advanced iteration of the COMPTEL and EGRET instruments
      previously used on the Compton Gamma Ray Observatory (CGRO) and the Large Area Telescope on NASA's Fermi mission. Enhanced calorimeters,
      anti-coincidence systems, and pair-conversion detectors will significantly improve sensitivity, angular resolution, and field of view.
      This broad energy coverage will enable the detection of the 511 keV gamma-ray line resulting from electron-positron annihilation, as well as nonthermal bremsstrahlung,
      synchrotron radiation, and Inverse Compton emissions. The observatory's capabilities will contribute to multi-wavelength time-domain astronomy by detecting events
      such as Gamma-Ray Bursts (GRBs), compact binary systems, flaring phenomena in blazars, and cosmic rays.
      With substantial observing time allocated to Principal Investigators (PIs) in India, this project will reduce dependence on foreign instruments like NASA's Fermi.
      It will not only bridge the existing MeV observational gap but also lay the foundation for novel high-energy astronomy endeavors in India.
      `
    },
    avatar: 'bhakti-mithagri',
    featured: false,
    inPerson: true
  },
  {
    given_name: 'Maria',
    surname: 'Alejandra Díaz',
    professional_title: 'Astronomer',
    bio: `Alejandra, with a Physics degree from UAM, Spain, has worked at the European Space Agency and is pursuing a PhD in Turku.
    Passionate about astronomy's societal impact, she's contributed to IAU's OAD projects and operates a telescope in La Palma alongside her thesis.`,
    abstract: {
      title: "Astronomy's Impact on Sustainability",
      description: `As human civilization continues advancing, the concept of sustainability—the harmony between economic development, social equity,
      and the environment—is becoming more and more crucial. In 2015 the United Nations General Assembly set 17 Sustainable Development Goals (SDG) with the aim to create
      a sustainable future for humanity by 2030. How can astronomy help meet these goals? The answer may surprise you!
      In this presentation we will provide an overview of different projects focused on astronomy for development and their impact on the SDGs. `
    },
    avatar: 'maria-alejandra-diaz',
    featured: false,
    inPerson: false
  },
  {
    title: 'Dr.',
    given_name: 'Jayanta',
    surname: 'Acharya',
    professional_title: 'Astronomer SPoC 2009 to till 2020',
    bio: `Professor Dr Jayanta Acharya,  has over 25 years of experience in educating astronomy in Nepal.
    He has created many astronomy clubs in Nepal. He distributed 100 small telescopes in Nepal for many schools and astronomy clubs.
    Takshashila Astronomy club (TAC) has many members and is very active in Nepal.  He worked as a Single Point of Contact For Nepal in astronomy year,
    2009 which was a great success worldwide and IAU National Outreach Coordinators (NOC) upto 2018.`,
    abstract: {
      title: 'Astrotourism in Nepal',
      description: `Nepal is a small landlocked country located in South Asia, between India and China.
      It is known for its stunning Himalayan mountain ranges, including Mount Everest, the highest peak in the world.
      Nepal is also known for its rich history and cultural heritage, with many temples and monuments dating back to the medieval period.
      we are  creating public awareness and interest in astronomy, as well as to encourage and support astronomical research in Nepal.
      we also conduct various activities such as public lectures, workshops, and sky observation sessions to promote astronomy in Nepal.
      We have just started astrotourisum in Nepal.
      The propose of the astrotourisum project in Neapal is to link scientefic knowledge and information thnology with the tourism industry.
      This paper describe some of the unique cultural activities related to astronomy. 
      `
    },
    avatar: 'jayanta-acharya',
    featured: false,
    inPerson: true
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
      description: `We have reached a strange situation in time. Space technology which was originally driven by the quest for the stars and space has reached a point where it threatens our view of the skies and observations by ground-based telescopes.
      The first mass launch of 60 Starlink satellites on 23 May 2019 by SpaceX, shocked astronomers all round the world with the obvious threat it posed to clear, dark skies.
      On the one hand, is the promise of broadband internet to underdeveloped and unaccessible areas of the globe, and on the other hand the brightly lit sky with trails
      of thousands on satellites is a heavy price and threat to all ground-based and space-based observations.
      These 'megaconstellations' will flood the skies in the near future and are a threat to astronomical observations.
      Satellites will be brighter then 99% of the present objects in orbit.
      In this article, we shall discuss the challenges posed to observatories by the exponential growth in satellite constellations and steps being taken to engage
      with the parties involved to (partially) solve these issues and the efforts being made to mitigate these effects.
      We shall also introduce the proposed activities of the recently setup IAU Centre for the Protection of the
      Dark and Quiet Skies from Satellite Constellation Interference and at Educating observers at all levels internationally to deal with this new urgent crisis.
      `
    },
    avatar: 'priya-hasan',
    inPerson: false,
    featured: true
  },
  {
    given_name: 'Vedvrat',
    surname: 'Vinayak Bedekar',
    professional_title: 'BE IT Student',
    bio: 'An amateur astronomer running an astronomy club in college. Frequent stargazer and host of stargazing events. ',
    abstract: {
      title: 'Light pollution: A Camouflaging pollution',
      description: `Since our childhood, whenever we look at the night sky; we get lost in the beauty of nature.
      The universe reveals the big chest of secrets in the form of light for us. But now in this modern era, The era of technology and revolution.
      This limitless treasure full of light is becoming dark because of the excessive amount of light emitted by humans.
      Due to this huge amount of light, the sky looks brighter instead of looking Dark.
      It's not just about losing sight of celestial wonders; it's about the health of ecosystems, energy conservation, and our well-being.
      In the future, if this continues, all the astronomers in the world will not be able to observe the beauty of the universe from Earth.
      This also applies to the natural ecosystem. Light pollution disrupts the animal and plant habitat in the polluted region.
      It also disturbs the sleep cycle and overall circadian rhythm of every living thing causing health problems to rise.
      To prevent this, we should become aware of light pollution and try to decrease it as soon and as much as possible.
      According to me, there are many ways by which we can collect data regarding light pollution with the help of light pollution meters, sky meters, etc.
      One of the best analog methods to figure out the light pollution in a specific area is finding the Limiting magnitude of the sky in that area.
      By analyzing the data collected through all these methods, we can come up with efficient solutions favorable to everyone.
      We can reduce the usage of highintensity lights in open areas or at least in astronomically important areas.
      We should add a new category 'Average Light Pollution' to the daily regional weather report.
      It will surely help to spread awareness about the seriousness of light pollution.
      We can also celebrate a special day called 'Dark Sky Preservation Day' when all the residents of the village/city will turn off their lights for a short period,
      just to observe, enjoy, study and appreciate the beauty of this Universe.
      We can initialize a movement 'Dark Sky Preservation Mission' just like the 'Swachh Bharat Mission' all over the nation.
      We can appreciate the villages and cities that are making special efforts to spread awareness and reduce light pollution in their area by awarding them
      with a unique 'Dark Sky Preservation Award' at a State and National level. We can find so many different solutions like this, unique to each geographical region.
      By doing so we will be able to give rise to a new generation of talented astronomers and we will be able to help Mother Nature to develop a healthy ecosystem in the region.`
    },
    avatar: 'vedvrat-bedekar',
    featured: false,
    inPerson: false
  },
  {
    given_name: 'David',
    surname: 'Ault',
    professional_title: 'Director of Education For Immersive Experiences',
    bio: `David is the Director of Education for Immersive Experiences, a UK planetarium and interactives company with a global footprint.
    With an astrophysics degree from Cambridge University, he entered the planetarium space in 2006, organising science festivals and starting a number of astronomy podcasts.`,
    abstract: {
      title: 'The planetarium as a creative space',
      description: `For over a decade, Immersive Experiences has been pushing the boundaries of how we can use planetariums to increase awareness not only of space, but of the fulldome performance space in general. To this end we have engaged universities,
      dance and drama schools and built up a catalogue of immersive presentations spanning festivals, events and history.
      In this presentation we seek to show some of the performances we have put on, as well as explain how others can use their domes - either inflatable or fixed - to best engage with the community, business and education around.`
    },
    avatar: 'david-ault',
    featured: false,
    inPerson: false
  },
  {
    given_name: 'Alejandro',
    surname: 'Sommer',
    professional_title:
      'Argentina DarkSky Chapter- Director of Ecotourism, Ministry of Tourism of the Province of Misiones',
    bio: 'Championing dark skies conservation in Misiones, Argentina, Alejandro Sommer blends astrotourism and storytelling to safeguard the night environment and indigenous cultural heritage. His advocacy underscores the potential of astrotourism in fostering a respectful interaction with natural and cultural legacies.',
    abstract: {
      title: 'Know to preserve',
      description: `Astrotourism as a conservation tool.
      Many times, we choose to make known a science, perhaps a bit harsh, that is not for everyone... 
      but when we put that knowledge, within an experience, in a natural environment, we take people to experience it first-hand a dark sky is when they realize their importance...
      after all, people cannot protect what they do not know... it is not the same... talking about the Milky Way, during the day in an urban center...
      that under the same in a clear sky!After all... half of a day... is in the dark! This is when we value how we guide a group of people,
      telling the wonders of the sky, through the emotions, of discovering the Milky Way for the first time, perhaps observing a planet. And we only talk about science...
      I won't even tell you when we develop the worldviews of some indigenous peoples
      `
    },
    avatar: 'alejandro-sommer',
    featured: false,
    inPerson: false
  },
  {
    given_name: 'Samyukta',
    surname: 'Manikumar',
    professional_title: 'Astrotourism Consultant',
    bio: `Samyukta, director of Noctia Institute, champions dark sky conservation through astrotourism. Blending science with cultural preservation,
    she's a fellow at the International Astronomical Union, focusing on rural astrotourism resources via the 'Socio-economic development through Astronomy Flagship'.`,
    abstract: {
      title: 'Harnessing Dark Skies for Socioeconomic Development in Rural Areas',
      description: `Night sky tourism encompasses tourism activities that take place at night and offer opportunities to engage with and appreciate the natural night sky.
      It distinguishes itself from astrotourism and celestial tourism by emphasising the creation of authentic experiences rooted in local culture and nature in rural areas.
      Night sky tourism in rural areas can be distinguished as a distinct form of tourism that capitalizes on dark rural skies and offers authentic experiences rooted
      in local culture and nature. It goes beyond astrotourism and celestial tourism by broadening the range of nighttime activities and lowering entry barriers.
      Experiential tourism principles, such as seeking authenticity and immersion, are fundamental to creating meaningful night sky experiences.
      By embracing the perspectives of rural communities and immersing visitors in unique nighttime environments, night sky tourism can empower rural inhabitants
      to develop transformational experiences that grow their economies while preserving their culture and way of living.
      This talk will describe the OAD's flagship project on this subject, and related resources that aim to support and expand night sky tourism globally. `
    },
    avatar: 'samyukta-manikumar',
    inPerson: false,
    featured: true
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
      description: `
      This paper deals with the problem to dark skies that are posed by the megaconstellations,
      which exist despite certain steps taken by the companies operating such megaconstellations to address the issue faced by astronomers.
      At Low earth orbit (LEO) (at to some extent MEO), the satellite signals are stronger and it takes less time for them to travel,
      compared to the GEO where there can be almost 500 milliseconds of delay between the request and the response. However,
      LEO satellites move fast with respect to the earth and one specific satellite is visible for a limited time only.
      Hence, a huge number of satellites in the form of mega-constellations are required to provide continuous coverage.
      The recent proposals for the mega-constellations have fuelled the debate on collisions in outer space.
      Even though some of the mega-constellations have taken several debris mitigation strategies into constellation design including the possibility
      of active debris removal and fuel reserves for a planned de-orbit manoeuvre that will remove the retired satellites, it cannot be denied that these
      mega-constellations may significantly alter the outer space environment. Further, with megaconstellations, satellites do not have high survivability rates,
      especially as satellite manufacturing has become cheaper. For example, when SpaceX launched Starlink's first batch of 60 satellites,
      3 satellites (i.e. 5% of the satellites) failed within days. However, these failed satellites continue to orbit the earth,
      thereby increasing the mass in outer space that affects astronomy. This paper, thus, will deal with how policy and regulatory restriction around
      mega-constellation may be relevant by reducing its harmful effect on maintaining the dark skies.
      The first steps needed is to ensure that non-functional satellites do not continue to orbit the earth for years.
      There are other steps also needed to be taken by national governments to ensure design changes and other restrictions on megaconstellations in order to protect the dark skies.
      `
    },
    featured: false,
    inPerson: true
  },
  {
    given_name: 'Dinesh',
    surname: 'Nisang',
    professional_title: 'Science Communicator',
    bio: `Dinesh founded Sunday Science School and is passionate about science communication. An astronomer, he views astronomy as a unifier for humanity.
    He enjoys astrophotography, exploring nature, and is an aspiring writer with articles and a book on scientific innovation. Focus: ISAAC.`,
    abstract: {
      title: 'Stellar Education: Unveiling ISAAC',
      description: `Sky and Astronomy - Fascination for ages
      The most ancient and the oldest hobby of mankind is Astronomy. Sky offered humans the most fascinating phenomena,
      which were mysterious, often fearful and at the same time challenging to human intelligence. As the Sun sets, people could see dark sky studded with stars. 
      It is important that students are made aware about the concepts from Astronomy and Space Science during school years.
      If their interest in Astronomy and Space Science is developed at a young age, then it is more likely that few of them may take up these subjects for higher studies and may become Astronomer, Space scientist or Astrophysicist in future. 
      Purpose of ISAAC
      The Interactive Space and Astronomy Activity Centre (ISAAC) is planned with the purpose of educating students about basic concepts in sky and space exploration.
      It shows students the fundamentals of Astronomy with the help of interactive models.
      Awareness about our solar system, the Sun, the Moon, Eclipses, comets with the help of models will leave a lasting impression in their mind.
      There are models about the Celestial coordinate system, planisphere, path of the Sun, Parallax method etc to give students a deep understanding of observational Astronomy.
      A separate section to make students aware about use of different technologies for space exploration and observations is also included in ISAAC.
      It has different optical telescopes for actual sky observation, models showing ray diagram of telescope, model of dish of radio telescope,
      different satellites and their launching, 3 D form of Astronaut and wall painting of ISS etc. are part of this section.
      Use of this centre for students
      The Interactive Space and Astronomy Activity Centre (ISAAC) will be of great help for students.
      In academic textbooks, there is a chapter on these subjects every year right from junior standards,
      however, a practical and interactive approach to teaching these subjects is missing in most of the schools.
      Many Corporation Schools are taking the most appropriate step to introduce these subjects in an interactive and entertaining way.
      It will become an example for tens of thousands of schools in India to follow.
      The ISAAC centre emphasizes on providing hands-on experience to the students. It has several Activity kits on Astronomy and Space related concepts. Kids can do activities on these subjects to understand basic concepts thoroughly. This is in line with NEP 2020. 
      How to raise funds from government for ISAAC ? 
      Well, there are various ways to get funds for the setting up Astronomy Activity centre. National Education Policy 2020 (NEP2020) already mentioned importance of "Hands-on" science education. Apart from that various schemes from central and state govt. like PM Shri Schools etc. are there. You can approach local guardian ministers for DPC funds. Local municipal corporation, Gram Panchayat have funds under "Innovative activity" Even many corporates are looking for better options to utilize their CSR funds. All you need to know about how to write a proposal, appropriate department to approach and zeal to communicate the importance of studying astronomy and space science.
      `
    },
    avatar: 'dinesh-nisang',
    featured: false,
    inPerson: true
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
      description: `The pressing issue of sustainability is one that students are constantly exposed to through their textbooks and are aware of. However, beyond conventional classroom lessons or group project presentations, there is a need to incorporate sustainable practices into astronomy education.
ASTROx is an interdisciplinary initiative that seeks to integrate astronomy with other academic subjects based on the Sustainable Development Goals. In this presentation, a student-led social innovation project centered on dark-sky advocacy and science communication will be highlighted as a solution to real-life community challenges. The students employed various methods such as outdoor classrooms, design thinking lessons, and practical experience to raise awareness about urban light pollution.`
    },
    avatar: 'exodus-chun-long-sit',
    featured: false,
    inPerson: false
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
      description: `Radio Astronomy is a growing field. It opens a window of observation in astronomy that is not largely affected by the atmosphere of earth,
      weather conditions and even day or night. Wide range of radio telescopes exist that observe in various bands in the radio frequency range.
      This allows observing different phenomenon in astrophysical objects. In this paper we present an affordable radio telescope, a pyramidal horn,
      made in house with low-cost equipment. This allows it to be used in college laboratories and for outreach programs.
      We have used the horn antenna to do the RFI survey of our campus. We have also observed the H-21 emission from our galaxy and plotted the rotation curve.
      With slight modification that we have planned we will be using it to study the radio emissions from the Sun.
      All these experiments can be easily performed in an undergraduate lab, during the day.
      We have also studied the radiation pattern of our horn and this helped us familiarize ourselves with the software used for studying radio patterns.
      Some more experiments that can be performed in college laboratory with this affordable set up include: Satellite and meteor tracking,
      receiving weather images and GPS data. Through this paper we want to put forward the point how affordable experiments can be setup in undergraduate lab.
      `
    },
    featured: false,
    inPerson: false
  },
  {
    given_name: 'Rashmi',
    surname: 'Sheoran',
    professional_title: 'CCL, IIT gandhinagar',
    bio: `Rashmi has worked in the space education sector for 5 years, with startups and government organisations.
    As "Astro Roxy" on social media with 60k+ followers, she makes astronomy accessible and popular in India,
    creates a thriving online community and is one of the few content creators to be recognised as ISRO Space Tutor.
    She's currently with IIT Gandhinagar's Centre for Creative Learning (CCL) lab, designing physics activities and doing astronomy outreach.`,
    abstract: {
      title: 'Day and Night on the Pale Blue Dot',
      description: `
      Commencing with the familiar concept of 24-hour days, where daytime and night duration vary yearly.
      I do a role-play with volunteers from the audience to act as the sun and earth to show how the earth moves around itself, and the sun and we have 24-hour long days. 
      The pivotal question emerges: "Would Earth still experience day and night if it stopped spinning?" In our exploration,
      we delve into the role of Earth's orbit around the Sun, revealing the emergence of six-month-long days and nights.
      Proceeding, we explore the intriguing scenario where the Earth stops revolving. Here, we explore the concept of sidereal and solar day.
      Further, we move on to the axial tilt, which plays a crucial role. We inquire, "How does Earth's tilt affect the duration of day and night?"
      from 0 degrees to 23 degrees reveal how we have seasons and phenomena like analemma. The exploration takes a fascinating turn when we examine an extreme scenario
      akin to Uranus, where Earth's tilt reaches a staggering 90 degrees. Here, one side of Earth continually faces the Sun,
      leading to perpetual daylight on that side and unending darkness on the opposite side, but there's so much more.
      Then, we bring our celestial neighbor, the Moon, into the picture. The roleplay is enjoyable at this point.
      The talk concludes by discussing the phases of the Moon through artistic images in famous paintings and eclipses using Tellurion made in CCL.
      If there's time, I would talk about the different colors of the sky.
      This talk simplifies intricate astronomical concepts, guiding you from Earth's daily rhythms to the captivating mysteries of lunar cycles.`
    },
    avatar: 'rashmi-sheoran',
    featured: false,
    inPerson: true
  },
  {
    title: 'Dr.',
    given_name: 'Kiran',
    surname: 'Kulkarni',
    professional_title: 'Indian Administrative Service Officer',
    bio: "Dr. Kulkarni has significantly contributed to tribal development, notably as Tribal Development Commissioner. While his work doesn't directly involve astronomy, his extensive outreach in education and governance innovations hints at a potential for fostering astronomy-related initiatives within tribal communities. His campaigns like Dream Melghat showcase his commitment to community upliftment, possibly providing a platform for intertwining traditional tribal knowledge with astronomical insights.",
    abstract: {
      title: 'Sustainable Development through Astronomy: A Tribal Perspective',
      description: `A tribal perspective towards sustainable development through Astronomy necessarily involves economic opportunity to tribal people
      with blending of sustained and non-exploitative use of natural resources leading to multi dimensional societal development of tribes.`
    },
    avatar: 'kiran-kulkarni',
    featured: true,
    inPerson: true
  },
  {
    given_name: 'João',
    surname: 'Retrê',
    professional_title: 'Science Communicator',
    bio: `João, a science communicator at the Institute of Astrophysics in Portugal, has 20 years of experience making astronomy accessible.
    He involves students in science communication, emphasizing its importance.
    He's the IAU's outreach coordinator for Portugal and leads the IAU sub-group for "Hospitals, Children Homes, Nursing Homes and Prisons"`,
    abstract: {
      title: 'Future Scientists in an Astrotourium',
      description: `
      Astrotourism is spreading all around the globe, opening a series of new opportunities for science, in particular Astronomy,
      to explore its strong multidisciplinary nature. This creates the need for a growing number of motivated people who are able to create a bridge between scientific research
      (not only Astronomy) and the public, with a strong scientific component and communication skills.
      Investing and developing these characteristics in science students and future researchers is essential.
      This contribution addresses a successful, low budget, informal education programme in astronomy that makes use of the practice of science communication
      as a way to enhance formal science education, stimulate the development of communication skills, and emphasise the importance of science communication in the context
      of scientific research. In this presentation, it will be covered the resources and methodologies applied, framed in a temporal evolution,
      that leads this programme to create high qualified professionals for Astrotourism. We will also evaluate the relevance of this programme to build a community
      of young scientists supporting Astrotourism, nurturing a culture of science communication in the research and non-research community.
    `
    },
    avatar: 'joao-retre',
    featured: true,
    inPerson: false
  },
  {
    given_name: 'Amshu',
    surname: 'CR',
    professional_title: 'Entrepreneur, Thapasu foods LLP',
    bio: 'Forest value chains, Land degradation, Biodynamic Agriculture, Tribal produce supply chains, Food security, knowledge preservation, Sustainablity ',
    abstract: {
      title: 'The ancient science of space and agriculture for sustainability and harmony',
      description: `
      Biodynamic Agriculture - Biodynamic agriculture was an answer to the farmers' call for help during the beginning of chemical farming
      in Europe when they noticed the rapid degeneration of the soil, of the quality of the produce, and of seed viability.
      They had been noticing a general decrease in vitality. The concept was then presented as a different way of looking at cultivation and the Earth in general,
      showing the inter-relationship and connections between all living things. The concept is very much influenced by oriental philosophy, especially Buddhism, Hinduism,
      and the Vedic scriptures. Agriculture is the base of human life. We need to grow food simply to eat each day, and to sustain our bodies, our minds, our souls and our spirit! 
      Biodynamic methods produce a living soil with revitalised natural forces, in alignment with planetary cosmic rhythms.
      At the heart of this activity is the intelligence and consciousness of the human being who is caring for this piece of the Earth, and who is the 'ordering principle'.
      This deep awareness is based on observation and relationship with the land and with Nature. 
      Biodynamic farming is a technique of crop production based on astronomical activities such as lunar cycles and also easy availability of locally-sourced materials.
      Moreover, this farming technique prohibits the use of chemicals and external mediums for crop production.
      This is an early researched topic under organic farming practices and involves much deeper space sciences with Vedic philosophy.
      Planting according to cosmic rhythms is a very complex process, as many factors (i.e., the perceived location of the sun and moon,
      position of the planets and constellations/stars, the equinoxes, etc.) must be taken into consideration in designing a planting schedule and what tasks
      to do at a particular hour and on a specific day. The talk discusses the need of reviving the concepts or much expansive adaption of the concepts in modern
      agriculture systems to improve the productivity of organic crop production. Need for more research and study to develop deeper knowledge on the science of space and agriculture. `
    },
    avatar: 'amshu-cr',
    featured: false,
    inPerson: false
  },
  {
    given_name: 'Albert',
    surname: 'Kuntu Forson',
    professional_title: 'PhD Research Student',
    bio: 'Albert, an engineer specializing in Radio Astronomy Instrumentation and radio interferometer designs at the University of Mauritius, holds the esteemed role of IAU-OAD National Astronomy Education Coordinator for Ghana. Additionally, he serves as the President for PRAGSAC and is highly enthusiastic about science communication.',
    abstract: {
      title:
        "Empowering Ghana's STEM Education: Bridging the Gap through Capacity Building in Astronomy Instrumentation",
      description: `Astronomy holds immense potential for STEM education and development. 
      In Africa, this potential remains largely untapped, with Ghana facing challenges in attracting students to STEM subjects.
      Contemporary progress heavily relies on technologies used in astronomical techniques, data analysis from celestial sources and satellites,
      and instrumentation processes, offering solutions to socio-economic issues like poverty and hunger, particularly in developing nations like Ghana.
      The AtroPhy project serves as a catalyst for graduate and undergraduate students, acting as a gateway to astronomy and space science.
      It provides students with hands-on experience in radio telescope engineering and operational techniques, utilizing the Table Top Radio Telescope (TTRT)
      for Galactic Hydrogen Emission (HI) studies and the development of small parabolic dish antennas. These innovative tools, including the TTRT and small parabolic
      dish antenna, offer valuable learning opportunities in astronomy, space science, and data science, both for training and outreach. By fostering practical skills,
      nurturing scientific curiosity, and promoting collaboration, AtroPhy plays a pivotal role towards addressing socio-economic challenges such as poverty, hunger,
      and illegal mining in Ghana.
      `
    },
    avatar: 'albert-forson',
    featured: false,
    inPerson: false
  },
  {
    given_name: 'Aishwarya',
    surname: 'Khade',
    professional_title: 'Mental Health Practitioner / Expressive Arts ',
    bio: 'A seasoned Psychologist and Mental Health Professional, Aishwarya Khade employs art and movement-based facilitation in educational and corporate settings. Specialized in corporate wellness, her drive is to enhance mental health and well-being through innovative methodologies.',
    abstract: {
      title: 'Mental Health Arts and Astronomy',
      description: `
      Aishwarya Khade's talk uncovers the intriguing interplay between art, astronomy, and psychology.
      She explores how art draws inspiration from the cosmos, how astronomy shapes our perception of the universe,
      and how psychology influences our connection to celestial phenomena. Her presentation highlights the profound relationships between these disciplines,
      offering a unique perspective on our understanding of the universe and our inner selves.`
    },
    avatar: 'aishwarya-khade',
    featured: false,
    inPerson: true
  },
  {
    given_name: 'Hosein',
    surname: 'Khezri',
    professional_title: 'Associate of Commission C1 WG Astronomy Education Research & Methods',
    bio: 'Affiliated with multiple astronomical unions including the IAU, Hosein Khezri is dedicated to elevating astronomy education and its cultural integration. His association with the Iranian Teachers Astronomy Union and various International Astronomical Union commissions reflects a broad engagement in promoting astronomy in diverse cultural landscapes.',
    abstract: {
      title: 'Road to Sky',
      description: `To change the perspective of students, teachers and parents.
      Also, creating interest in astronomy among people,
      Changing the environment and creating astronomical elements is very effective.
      Among these, we can mention the making of sundials and solar calendars.
      This simple tool can take a unique shape by combining the cultures of each region and establish better communication with the audience.
      At first, only showing the time and day of the year is attractive,
      but step by step, the audience notices the changes and daily and annual rotation of the earth and the sun,
      and this is where the enthusiasts look for the cause with curiosity.
      And their questioning mind sparks science. For a better understanding of astronomy and cosmology.`
    },
    avatar: 'hossein-khezri',
    featured: false,
    inPerson: false
  },
  {
    given_name: 'Shweta',
    surname: 'Kulkarni',
    professional_title: 'Founder/Director of AstronEra',
    bio: 'Astropreneur Shweta Kulkarni, listed among top 100 women entrepreneurs, spearheads Astronera, marrying business acumen with astronomy for innovative solutions. As a Fellow of the Royal Astronomical Society of England, her venture reflects a novel approach to integrating astronomy with enterprise.',
    abstract: {
      title: 'Skill Training in Astronomy for Income Generation',
      description: `This presentation explores skill training in astronomy as a means of income generation while emphasizing a solution-oriented approach.
      It underscores how astronomy, when combined with a problem-solving mindset, can significantly contribute to Sustainable Development Goals (SDGs),
      particularly SDG 4 (Education) and SDG 8 (Employment & Economic Growth). By fostering inclusive and equitable education, lifelong learning opportunities,
      and sustainable economic growth, astronomy-related skills not only provide livelihoods but also actively address challenges such as light pollution.
      This presentation highlights the transformative power of turning one's passion into a problem-solving career
      and making a positive impact on both personal income and global issues.`
    },
    avatar: 'shweta-kulkarni',
    featured: true,
    inPerson: true
  }
] as SpeakerType[]

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

<style scoped></style>
