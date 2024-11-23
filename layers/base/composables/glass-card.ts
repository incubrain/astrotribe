interface GlassCardProps {
  color: string
  bgOpacity: number
  gradientOpacity: number
  blurIntensity: string
  disableHover: boolean
  padding: string
  loading: boolean
  ariaLabel: string
}

const cardStates = reactive<Record<string, any>>({})

export function useGlassCard(props: GlassCardProps, uniqueId: string) {
  if (!cardStates[uniqueId]) {
    cardStates[uniqueId] = {
      tiltFactor: 0,
      mouseX: 0,
      mouseY: 0,
      isOutside: true,
      cardWidth: 0,
      cardHeight: 0,
    }
  }

  const state = cardStates[uniqueId]

  const handleMouseMove = (event: MouseEvent) => {
    const cardElement = document.getElementById(uniqueId)?.querySelector('.glass-card')
    if (!cardElement) return

    const cardRect = cardElement.getBoundingClientRect()

    state.cardWidth = cardRect.width
    state.cardHeight = cardRect.height

    const gravityArea = 100 // pixels around the card
    const x = event.clientX - cardRect.left
    const y = event.clientY - cardRect.top

    // Check if the mouse is within the gravity field
    if (
      x >= -gravityArea &&
      x <= cardRect.width + gravityArea &&
      y >= -gravityArea &&
      y <= cardRect.height + gravityArea
    ) {
      state.mouseX = x
      state.mouseY = y
      state.isOutside = false

      // Calculate distance from the edge of the card
      const distanceX = Math.max(0, -x, x - cardRect.width)
      const distanceY = Math.max(0, -y, y - cardRect.height)
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

      // Calculate tilt factor
      if (x >= 0 && x <= cardRect.width && y >= 0 && y <= cardRect.height) {
        state.tiltFactor = 1 // Cursor is directly over the card
      } else {
        // Smooth transition in the gravity area
        state.tiltFactor = Math.max(0, 1 - distance / gravityArea)
      }
    } else {
      state.tiltFactor = 0
      state.isOutside = true
    }
  }

  const handleMouseLeave = () => {
    state.tiltFactor = 0
    state.isOutside = true
  }

  const cardStyle = computed(() => {
    if (state.isOutside) return {}

    const maxTilt = 4 // maximum tilt in degrees

    // Use cardWidth and cardHeight from state instead of getting them from cardRef
    const centerX = state.cardWidth / 2
    const centerY = state.cardHeight / 2

    const tiltY = ((state.mouseX - centerX) / centerX) * maxTilt * state.tiltFactor
    const tiltX = ((centerY - state.mouseY) / centerY) * maxTilt * state.tiltFactor

    return {
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
      transition: state.isOutside ? 'transform 0.3s ease-out' : 'none',
    }
  })

  const spotlightColor = computed(() => {
    const hue = (state.mouseX / state.cardWidth) * 360
    return `hsl(${hue}, 100%, 70%)`
  })

  const spotlightStyle = computed(() => {
    if (state.isOutside) return { opacity: 0 }

    const spotlightSize = 300 // Fixed 300px radius
    const opacity = 0.07 + state.tiltFactor * 0.08

    return {
      background: `
      radial-gradient(circle ${spotlightSize}px at ${state.mouseX}px ${state.mouseY}px, 
      ${spotlightColor.value}, 
      transparent 70%),
      radial-gradient(circle ${spotlightSize * 0.8}px at ${state.mouseX}px ${state.mouseY}px, 
      ${spotlightColor.value}, 
      transparent 70%)
    `,
      opacity: opacity,
      transition: 'opacity 0.3s ease-out',
      mixBlendMode: 'soft-light',
    }
  })

  const bgClasses = computed(() => [
    `bg-${props.color}-950/${props.bgOpacity}`,
    `hover:bg-${props.color}-900/${props.bgOpacity + 10}`,
  ])

  const borderClasses = computed(() => [
    'border',
    'border-color',
    `hover:border-${props.color}-400/40`,
  ])

  const textClasses = computed(() => [`text-${props.color}-100`])

  const gradientClasses = computed(() => [
    `from-${props.color}-100/${props.gradientOpacity}`,
    `to-${props.color}-500/${props.gradientOpacity}`,
  ])

  const hoverClasses = computed(() =>
    props.disableHover ?
      [] :
      ['hover:shadow-2xl', `hover:bg-${props.color}-800/${props.bgOpacity + 10}`],
  )

  return {
    handleMouseMove,
    handleMouseLeave,
    cardStyle,
    spotlightStyle,
    bgClasses,
    borderClasses,
    textClasses,
    gradientClasses,
    hoverClasses,
  }
}
