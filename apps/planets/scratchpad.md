# Solar System Planets Visualization

## New Direction

We're expanding the visualization to include all planets in the solar system with a consistent look and feel:

- Each planet will have the same visual size on screen (not scientifically accurate)
- One planet per view with a tabbed interface to switch between planets
- Consistent rotation speed with override capability
- Clean, minimalist UI focused on the planet visualization

## Core Requirements

1. **Consistent Visual Presentation**
   - All planets should appear the same size on screen
   - Consistent lighting and material properties
   - Uniform camera distance

2. **Override System**
   - Allow optional scientific mode with accurate relative sizes and rotation speeds
   - Add configuration options but don't implement the full scientific mode yet

3. **Navigation**
   - Tabbed interface to switch between planets
   - One planet displayed at a time
   - Smooth transitions between planets

## Directory Structure

```
/apps/planets/
├── public/
│   └── textures/
│       ├── mercury_map.jpg
│       ├── venus_map.jpg
│       ├── earth_map.jpg
│       ├── mars_map.jpg
│       ├── jupiter_map.jpg (existing)
│       ├── saturn_map.jpg
│       ├── saturn_rings.png
│       ├── uranus_map.jpg
│       └── neptune_map.jpg
├── src/
│   ├── main.ts (entry point)
│   ├── planets/
│   │   ├── index.ts (exports all planets)
│   │   ├── mercury.ts
│   │   ├── venus.ts
│   │   ├── earth.ts
│   │   ├── mars.ts
│   │   ├── jupiter.ts
│   │   ├── saturn.ts
│   │   ├── uranus.ts
│   │   └── neptune.ts
│   ├── components/
│   │   ├── PlanetRenderer.ts (shared rendering logic)
│   │   ├── SceneSetup.ts (camera, lights, controls)
│   │   └── TabNavigation.ts (tab UI for switching planets)
│   └── utils/
│       ├── constants.ts (shared constants)
│       └── config.ts (configuration including overrides)
├── index.html
├── style.css
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Files to Adapt

### index.html
- Update title to "Solar System Planets"
- Add tab navigation UI for planet selection
- Keep the canvas as the main element

### style.css
- Keep the current minimalist styling
- Add styles for the tab navigation
- Ensure responsive design for all screen sizes

### main.ts
- Refactor to be a controller that loads the selected planet
- Implement tab-based planet switching functionality
- Set up configuration system with override capability

## Core Components

### PlanetRenderer.ts
```typescript
// Core rendering logic shared by all planets
export class PlanetRenderer {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  planet: THREE.Mesh;
  clock: THREE.Clock;
  config: PlanetConfig;
  
  constructor(planetConfig: PlanetConfig, overrides?: ConfigOverrides) {
    this.config = this.applyOverrides(planetConfig, overrides);
    // Initialize scene, camera, renderer, lights
    // Create planet mesh based on config
  }
  
  applyOverrides(config: PlanetConfig, overrides?: ConfigOverrides) {
    // Apply any overrides to the default configuration
    // This allows for scientific mode without implementing it yet
    return { ...config, ...(overrides || {}) };
  }
  
  animate() {
    // Animation loop with planet-specific rotation
  }
  
  resize() {
    // Handle window resizing
  }
}
```

### constants.ts
```typescript
// Shared constants for all planets
export interface PlanetConfig {
  id: string;
  name: string;
  texturePath: string;
  rotationPeriod: number; // In seconds for one full rotation
  axialTilt: number;      // Degrees
  color: string;          // Accent color for UI
  hasRings?: boolean;     // For Saturn
  ringsTexturePath?: string;
}

export interface ConfigOverrides {
  size?: number;          // For scientific mode
  rotationPeriod?: number; // For scientific mode
  // Other potential overrides
}

export const DEFAULT_SIZE = 0.15; // Same size for all planets
export const DEFAULT_ROTATION_PERIOD = 120; // 2 minutes for all planets by default

export const PLANETS: Record<string, PlanetConfig> = {
  mercury: {
    id: 'mercury',
    name: 'Mercury',
    texturePath: '/textures/mercury_map.jpg',
    rotationPeriod: DEFAULT_ROTATION_PERIOD,
    axialTilt: 0.03,
    color: '#A5A5A5'
  },
  venus: {
    id: 'venus',
    name: 'Venus',
    texturePath: '/textures/venus_map.jpg',
    rotationPeriod: DEFAULT_ROTATION_PERIOD,
    axialTilt: 177.3,
    color: '#E6C073'
  },
  // etc. for all planets
}
```

## Planet Specifications

### Mercury
- **Texture**: Gray/tan cratered surface
- **Default Rotation**: 2 minutes (same as all planets)
- **UI Color**: #A5A5A5 (gray)

### Venus
- **Texture**: Yellowish cloud cover
- **Default Rotation**: 2 minutes
- **UI Color**: #E6C073 (light orange/yellow)

### Earth
- **Texture**: Blue oceans, green/brown landmasses, white clouds
- **Default Rotation**: 2 minutes
- **UI Color**: #3D85C6 (blue)

### Mars
- **Texture**: Reddish surface with darker regions
- **Default Rotation**: 2 minutes
- **UI Color**: #CC4125 (rust red)

### Jupiter
- **Texture**: Existing texture with bands and Great Red Spot
- **Default Rotation**: 2 minutes
- **UI Color**: #E07E38 (orange)

### Saturn
- **Texture**: Yellowish with subtle bands
- **Default Rotation**: 2 minutes
- **Special Features**: Ring system (separate texture)
- **UI Color**: #D4B46A (gold)

### Uranus
- **Texture**: Cyan-blue featureless
- **Default Rotation**: 2 minutes
- **UI Color**: #5CACCE (cyan)

### Neptune
- **Texture**: Deep blue with subtle features
- **Default Rotation**: 2 minutes
- **UI Color**: #3953A4 (deep blue)

## Tab Navigation Design

- Simple, clean tabs at the top of the screen
- Each tab shows the planet name and a small colored indicator
- Active tab is highlighted
- Responsive design that works on mobile and desktop

## Implementation Plan

### Phase 1: Core Architecture
1. Refactor existing Jupiter code into modular components
2. Create the PlanetRenderer class with override capability
3. Implement tab-based navigation UI

### Phase 2: Planet Implementation
1. Acquire high-quality textures for all planets
2. Implement each planet using the shared renderer
3. Special handling for Saturn's rings

### Phase 3: Refinement
1. Ensure consistent appearance across all planets
2. Optimize performance
3. Add smooth transitions between planets

## Technical Considerations

### Consistent Visualization Rules
- All planets appear the same size on screen
- Same camera distance for all planets
- Consistent lighting model
- Similar material properties for realistic appearance
- Default 2-minute rotation period for all planets

### Override System Design
- Configuration object that can be passed to override defaults
- Support for scientific mode without implementing it yet
- Clean separation between default and override values

### Performance Optimization
- Load only the currently selected planet
- Preload textures for adjacent planets in the tab order
- Optimize texture sizes for web performance

This plan provides a comprehensive framework for creating a consistent, visually appealing planet visualization system with the flexibility to add scientific accuracy in the future.
