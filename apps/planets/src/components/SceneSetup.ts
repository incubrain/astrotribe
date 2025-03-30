import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export class SceneSetup {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  controls: OrbitControls
  private boundHandleResize: () => void

  constructor(canvas: HTMLCanvasElement) {
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
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace

    // Add orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05

    // Bind event handlers
    this.boundHandleResize = this.handleResize.bind(this)

    // Add lighting
    this.setupLighting()

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

  private setupEventListeners(): void {
    window.addEventListener('resize', this.boundHandleResize)
  }

  private handleResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  public dispose(): void {
    // Clean up resources
    this.controls.dispose()

    // Remove event listeners
    window.removeEventListener('resize', this.boundHandleResize)
  }
}
