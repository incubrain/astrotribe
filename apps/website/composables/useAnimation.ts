// composables/useAnimation.ts
import { onMounted, watch } from 'vue'

export interface AnimationOptions {
  duration?: number
  delay?: number
  ease?: string
  stagger?: number
  minValue?: number
  [key: string]: any
}

// utils/motionConstants.ts

/**
 * Common animation variants that can be reused across components
 * for consistent animations throughout the application.
 *
 * Usage in components:
 *
 * <div v-motion :initial="motionConstants.fadeUp.initial" :enter="motionConstants.fadeUp.enter">
 *   Content
 * </div>
 *
 * OR with delays:
 *
 * <div v-motion
 *   :initial="motionConstants.fadeUp.initial"
 *   :visibleOnce="{ ...motionConstants.fadeUp.enter, transition: { ...motionConstants.fadeUp.enter.transition, delay: 0.3 } }">
 *   Content
 * </div>
 */

export const MOTION_CONSTANTS = {
  // Standard fade up animation
  fadeUp: {
    initial: {
      opacity: 0,
      y: 50,
    },
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
      },
    },
  },

  // Simple fade in
  fadeIn: {
    initial: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
      transition: {
        duration: 800,
      },
    },
  },

  // Left to right slide
  slideRight: {
    initial: {
      opacity: 0,
      x: -50,
    },
    enter: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
      },
    },
  },

  // Right to left slide
  slideLeft: {
    initial: {
      opacity: 0,
      x: 50,
    },
    enter: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
      },
    },
  },

  // Scale animation
  scale: {
    initial: {
      opacity: 0,
      scale: 0.8,
    },
    enter: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
      },
    },
  },

  // Bouncy animation
  bounce: {
    initial: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    enter: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 8,
      },
    },
  },

  // Section title animation
  sectionTitle: {
    initial: {
      opacity: 0,
      y: 30,
    },
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    },
  },

  // Card animation
  card: {
    initial: {
      opacity: 0,
      y: 50,
      scale: 0.95,
    },
    enter: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
      },
    },
    // For hover effect
    hovered: {
      y: -5,
      scale: 1.03,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 15,
      },
    },
  },

  // Button animation
  button: {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    enter: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 15,
      },
    },
    // For hover effect
    hovered: {
      scale: 1.05,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 10,
      },
    },
    // For tap effect
    tapped: {
      scale: 0.95,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 10,
      },
    },
  },
}

export function useAnimation() {
  /**
   * Animates number counters that have a data-value attribute
   *
   * @param selector CSS selector for counter elements
   * @param options Animation options
   */
  const animateCounter = (selector: string, options: AnimationOptions = {}) => {
    if (!import.meta.client) return

    try {
      const elements = document.querySelectorAll(selector)
      if (!elements.length) return

      elements.forEach((element, index) => {
        const value = element.getAttribute('data-value')
        if (!value) return

        const numberValue = parseInt(value, 10)
        if (isNaN(numberValue)) return

        // Animation options
        const duration = options.duration || 1500
        const delay = options.delay || 0
        const staggerDelay = options.stagger ? options.stagger * 1000 * index : 0
        const totalDelay = delay + staggerDelay
        const minValue = options.minValue || 0

        // Start from min value
        element.textContent = minValue.toString()

        // Wait for any delay
        setTimeout(() => {
          // Calculate increment per frame for smooth animation
          // Assuming 60fps, so each frame is about 16.67ms
          const totalFrames = duration / 16.67
          const valueRange = numberValue - minValue
          const incrementPerFrame = valueRange / totalFrames

          let currentValue = minValue

          // Animation frame function
          const updateCounter = () => {
            currentValue += incrementPerFrame

            // Don't exceed the target value
            if (currentValue > numberValue) {
              currentValue = numberValue
            }

            // Update the element with rounded value
            element.textContent = Math.round(currentValue).toString()

            // Continue animation until complete
            if (currentValue < numberValue) {
              requestAnimationFrame(updateCounter)
            }
          }

          // Start the animation
          updateCounter()
        }, totalDelay)
      })
    } catch (err) {
      console.error('Error animating counters:', err)
    }
  }

  /**
   * Animates typing effect on text elements
   *
   * @param selector CSS selector for text elements
   * @param options Animation options
   */
  const animateTyping = (selector: string, options: AnimationOptions = {}) => {
    if (!import.meta.client) return

    try {
      const elements = document.querySelectorAll(selector)
      if (!elements.length) return

      elements.forEach((element, index) => {
        // Get the final text
        const finalText = element.textContent || ''
        if (!finalText.length) return

        // Animation options
        const duration = options.duration || 1000
        const delay = options.delay || 0
        const staggerDelay = options.stagger ? options.stagger * 1000 * index : 0
        const totalDelay = delay + staggerDelay

        // Character typing speed
        const charDuration = duration / finalText.length

        // Start with empty text
        element.textContent = ''

        // Wait for any delay
        setTimeout(() => {
          let charIndex = 0

          // Type each character with setTimeout
          const typeNextChar = () => {
            if (charIndex < finalText.length) {
              element.textContent += finalText.charAt(charIndex)
              charIndex++
              setTimeout(typeNextChar, charDuration)
            }
          }

          // Start typing
          typeNextChar()
        }, totalDelay)
      })
    } catch (err) {
      console.error('Error animating typing:', err)
    }
  }

  return {
    animateCounter,
    animateTyping,
    conf: MOTION_CONSTANTS,
  }
}
