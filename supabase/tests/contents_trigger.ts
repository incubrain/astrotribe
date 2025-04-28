import db from './db'

async function main() {
  const client = await db()
  console.log('🟢 Connected to local Supabase Postgres')

  const insertQuery = `
    INSERT INTO public.contents (id, content_type, url, title, featured_image, details)
    VALUES (
      gen_random_uuid(),
      'news',
      'https://www.nasa.gov/blogs/spacestation/2025/04/25/crew-studies-space-biology-advancing-health-in-space-and-on-earth/',
      'Crew Studies Space Biology Advancing Health in Space and on Earth',
      $1,
      $2::jsonb
    )
    RETURNING id;
  `

  const featuredImage =
    'https://images-assets.nasa.gov/image/iss073e0000313/iss073e0000313~large.jpg?w=1280&h=1920&fit=crop&crop=faces%2Cfocalpoint'

  const details = {
    extracted_content: `Synthetic DNA, how cells respond to weightlessness, and cognitive performance in space wrapped up the week aboard the International Space Station. The Expedition 73 crew is also gearing up for a spacewalk to ready the orbital outpost for a new rollout solar array.

Space biology is helping doctors understand how humans adapt to living in space and providing countermeasures to keep crews healthy on long duration missions farther away from Earth. Results may also provide advanced treatments for ailments on Earth.

A new experiment recently delivered aboard the SpaceX Dragon cargo spacecraft is exploring the ability to manufacture DNA-like nanomaterials that could be used to deliver therapeutics, vaccines, and regenerative medicine. NASA Flight Engineers Anne McClain and Nichole Ayers kicked off that experiment on Friday mixing solutions to create the nanomaterial products inside the Kibo laboratory module's Life Science Glovebox. Ayers then pointed an electromagnetic light tool at the newly created materials, measured the wavelengths emitted, and evaluated their space-manufactured quality. The samples will be returned to Earth for further analysis.

McClain and Ayers are also getting ready for a spacewalk scheduled for May 1. The duo will exit the Quest airlock into the vacuum of space and spend six-and-a-half hours preparing the station's port side truss structure for a new rollout solar array and relocating an antenna that communicates with visiting vehicles. McClain spent an hour-and-a-half on Friday studying the paths she and Ayers will take to their worksites outside the space station.

A second investigation unloaded from Dragon and activated by station Commander Takuya Onishi of JAXA (Japan Aerospace Exploration Agency) is observing how cells sense gravity. Onishi spent Friday processing cell samples inside Kibo's Cell Biology Experiment Facility before placing the samples inside a confocal microscope for observation. How those cells samples adapt to microgravity may help scientists provide advanced treatments for space-caused as well as Earth-based conditions such muscle atrophy, osteoporosis, and aging-like symptoms.

NASA Flight Engineer Jonny Kim focused his research activities on learning how living in space is affecting his cognition, or the ability to think and perform actions in microgravity. CIPHER is a suite of 14 human research studies looking at the physical and mental changes an astronaut experiences during spaceflight. Kim first collected his blood samples for processing and analysis. Next, he took a series of tests that included simulating Canadarm2 robotic arm maneuvers on a computer. The Spatial Cognition portion of the CIPHER study will help doctors learn about and prevent any adverse effects of space on a crew member's brain structure and function.

Roscosmos Flight Engineer Kirill Peskov wrapped up an Earth observation experiment that imaged the planet's nighttime atmospheric glow in near-ultraviolet wavelengths. Cosmonauts Sergey Ryzhikov and Alexey Zubritsky spent their day on life support maintenance throughout the orbiting lab's Roscosmos segment.

Robotics controllers completed the extraction late Thursday of the Atomic Clock Ensemble in Space (ACES) experiment from Dragon's unpressurized trunk. ACES will be installed outside the Columbus laboratory module for a variety of tests including testing Einstein's theory of general relativity as well as researching fundamental physics using high accuracy atomic clocks in space.`,
    extracted_at: new Date().toISOString(),
    word_count: 475,
    metadata: {
      language: 'en',
      source: 'NASA',
      category: 'Science',
      topics: ['Space', 'Biology', 'ISS', 'Research'],
    },
  }

  try {
    const result = await client.query(insertQuery, [featuredImage, JSON.stringify(details)])
    console.log(`✅ Row inserted. Triggered webhooks for ID: ${result.rows[0].id}`)
    console.log('Check your Mastra server logs to see if the webhook was triggered')
  } catch (error) {
    console.error('❌ Failed to insert row:', error)
  } finally {
    await client.end()
    console.log('🔴 Connection closed')
  }
}

main()
