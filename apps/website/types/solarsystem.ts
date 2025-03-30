// Types for the solar system components

export interface Resource {
  name: string
  url: string
}

export interface Mission {
  name: string
  year: string
  description: string
}

export interface PlanetMoon {
  id: string
  name: string
  image: string
  description: string
}

export interface Planet {
  id: string
  name: string
  facts: string[]
  resources: Resource[]
  moons: PlanetMoon[]
  image: string
  missions: {
    previous: Mission[]
    upcoming: Mission[]
  }
  videoId: string
}
