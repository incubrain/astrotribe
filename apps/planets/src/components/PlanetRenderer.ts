import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { PlanetConfig, ConfigOverrides } from '../utils/constants'
import { applyOverrides } from '../utils/config'

export class PlanetRenderer {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  controls: OrbitControls
  planet: THREE.Mesh
  rings?: THREE.Mesh
  clock: THREE.Clock
  config: PlanetConfig
  private boundHandleResize: () => void
  private textureLoader: THREE.TextureLoader
  private isDisposed: boolean = false
  private texturesLoaded: boolean = false
  private animationFrameId?: number

  constructor(planetConfig: PlanetConfig, canvas: HTMLCanvasElement, overrides?: ConfigOverrides) {
    this.config = applyOverrides(planetConfig, overrides)
    this.clock = new THREE.Clock()
    this.textureLoader = new THREE.TextureLoader()

    // Initialize scene
    this.scene = new THREE.Scene()

    // Initialize camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200000)
    this.camera.position.set(0, 0, 0.25) // Positioned to see a portion of planet's surface in detail
    this.camera.lookAt(0, 0, 0)

    // Initialize renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace

    // Add orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05

    // Add lighting
    this.setupLighting()

    // Create planet
    this.planet = this.createPlanet()
    this.scene.add(this.planet)

    // Create rings if applicable
    if (this.config.hasRings && this.config.ringsTexturePath) {
      this.rings = this.createRings()
      this.scene.add(this.rings)
    }

    // Bind event handlers
    this.boundHandleResize = this.handleResize.bind(this)

    // Set up event listeners
    this.setupEventListeners()
  }

  private setupLighting(): void {
    // Main directional light
    const pointLight = new THREE.PointLight(0xffffff, 3.0, 0, 1)
    pointLight.position.set(1, 0.5, 1) // Light positioned to highlight surface details
    this.scene.add(pointLight)

    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    this.scene.add(ambientLight)
  }

  private createPlanet(): THREE.Mesh {
    // Create geometry and material
    const geometry = new THREE.SphereGeometry(1 * 0.15, 64, 32)

    // Create a basic material first
    const material = new THREE.MeshStandardMaterial({
      roughness: 0.6,
      metalness: 0.2,
      color: this.config.color,
    })

    // Create mesh
    const mesh = new THREE.Mesh(geometry, material)

    // Apply axial tilt
    mesh.rotation.z = THREE.MathUtils.degToRad(this.config.axialTilt)

    // Load texture asynchronously to avoid WebGL errors
    this.loadPlanetTexture(material)

    return mesh
  }

  private loadPlanetTexture(material: THREE.MeshStandardMaterial): void {
    // Create a new texture loader for each texture to avoid conflicts
    const loader = new THREE.TextureLoader()

    // Disable automatic flipping which can cause WebGL warnings
    THREE.ImageUtils.getDataURL = function () {
      return ''
    }

    loader.load(
      this.config.texturePath,
      (texture) => {
        if (this.isDisposed) return

        // Once texture is loaded, apply it to the material
        texture.colorSpace = THREE.SRGBColorSpace
        texture.generateMipmaps = true
        texture.minFilter = THREE.LinearMipmapLinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy()

        material.map = texture
        material.needsUpdate = true

        this.texturesLoaded = true
      },
      undefined,
      (error) => {
        console.error(`Error loading texture for ${this.config.name}:`, error)
      },
    )
  }

  private createRings(): THREE.Mesh {
    // Only applicable for Saturn
    // Create ring geometry (flat disk with hole)
    const innerRadius = 0.2
    const outerRadius = 0.4
    const segments = 64
    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, segments)

    // Create material with transparency
    const material = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      roughness: 0.8,
      metalness: 0.1,
      color: 0xffffff,
    })

    // Create mesh
    const rings = new THREE.Mesh(geometry, material)

    // Apply same rotation as planet for axial tilt
    rings.rotation.z = THREE.MathUtils.degToRad(this.config.axialTilt)
    rings.rotation.x = Math.PI / 2 // Lay flat

    // Load texture asynchronously
    if (this.config.ringsTexturePath) {
      // Create a new texture loader for each texture to avoid conflicts
      const loader = new THREE.TextureLoader()

      loader.load(
        this.config.ringsTexturePath,
        (texture) => {
          if (this.isDisposed) return

          texture.colorSpace = THREE.SRGBColorSpace
          texture.generateMipmaps = true
          texture.minFilter = THREE.LinearMipmapLinearFilter
          texture.magFilter = THREE.LinearFilter
          texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy()

          material.map = texture
          material.needsUpdate = true

          this.texturesLoaded = true
        },
        undefined,
        (error) => {
          console.error(`Error loading rings texture for ${this.config.name}:`, error)
        },
      )
    }

    return rings
  }

  private setupEventListeners(): void {
    window.addEventListener('resize', this.boundHandleResize)
  }

  private handleResize(): void {
    if (this.isDisposed) return

    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  public animate(): void {
    if (this.isDisposed) return

    this.animationFrameId = requestAnimationFrame(() => this.animate())

    const delta = this.clock.getDelta() // Time since last frame in seconds

    // Calculate rotation speed in radians per second
    // 2π radians = full rotation
    // rotationPeriod = seconds for full rotation
    // rotationSpeed = 2π / rotationPeriod
    const rotationSpeed = (Math.PI * 2) / this.config.rotationPeriod

    // Rotate planet
    this.planet.rotation.y += rotationSpeed * delta

    // Update controls
    this.controls.update()

    try {
      // Render scene
      this.renderer.render(this.scene, this.camera)
    } catch (error) {
      console.warn('Rendering error:', error)
      // If we encounter a rendering error, we'll just skip this frame
      // This prevents the WebGL context from getting into a bad state
    }
  }

  public dispose(): void {
    // Mark as disposed to prevent further operations
    this.isDisposed = true

    // Cancel any pending animation frame
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = undefined
    }

    // Clean up resources
    if (this.controls) {
      this.controls.dispose()
    }

    // Remove event listeners
    window.removeEventListener('resize', this.boundHandleResize)

    // Dispose geometries and materials
    if (this.planet) {
      if (this.planet.geometry) this.planet.geometry.dispose()

      if (this.planet.material) {
        const material = this.planet.material as THREE.MeshStandardMaterial
        if (material.map) material.map.dispose()
        material.dispose()
      }
    }

    if (this.rings) {
      if (this.rings.geometry) this.rings.geometry.dispose()

      if (this.rings.material) {
        const material = this.rings.material as THREE.MeshStandardMaterial
        if (material.map) material.map.dispose()
        material.dispose()
      }
    }

    // Clear the scene
    while (this.scene.children.length > 0) {
      const object = this.scene.children[0]
      this.scene.remove(object)
    }

    // Dispose of the renderer context
    // Note: We don't actually dispose of the renderer itself as it's shared
    this.renderer.renderLists.dispose()

    // Clear references
    this.planet = null as any
    this.rings = null as any
    this.scene = null as any
    this.camera = null as any
    this.controls = null as any
  }
}
