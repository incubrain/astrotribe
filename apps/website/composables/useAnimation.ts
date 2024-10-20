// composables/useAnimation.ts
import { onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useAnimation() {
  const fadeInUp = (elements: string, options = {}) => {
    gsap.from(elements, {
      opacity: 0,
      y: 50,
      duration: 0.8,
      stagger: 0.2,
      scrollTrigger: {
        trigger: elements,
        start: 'top bottom-=100px',
        toggleActions: 'play none none reverse',
      },
      ...options,
    })
  }

  const scaleOnHover = (elements: string) => {
    gsap.utils.toArray(elements).forEach((el: Element) => {
      gsap
        .to(el, {
          scale: 1.1,
          duration: 0.3,
          paused: true,
        })
        .reverse()

      el.addEventListener('mouseenter', () => gsap.to(el, { scale: 1.1, duration: 0.3 }))
      el.addEventListener('mouseleave', () => gsap.to(el, { scale: 1, duration: 0.3 }))
    })
  }

  const carouselFadeIn = (elements: string, options = {}) => {
    gsap.from(elements, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: elements,
        start: 'top bottom-=100px',
      },
      ...options,
    })
  }

  const staggeredFadeIn = (elements: string, stagger = 0.1, options = {}) => {
    gsap.from(elements, {
      opacity: 0,
      duration: 0.5,
      stagger: stagger,
      ease: 'power2.out',
      ...options,
    })
  }

  const parallax = (element: string, options = {}) => {
    gsap.to(element, {
      y: '30%',
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        scrub: true,
      },
      ...options,
    })
  }

  // New animations
  const fadeInScale = (elements: string, options = {}) => {
    gsap.from(elements, {
      opacity: 0,
      scale: 0.8,
      duration: 0.5,
      ease: 'back.out(1.7)',
      ...options,
    })
  }

  const typewriterEffect = (element: string, text: string, options = {}) => {
    gsap.to(element, {
      duration: 2,
      text: text,
      ease: 'none',
      ...options,
    })
  }

  const flipCard = (frontElement: string, backElement: string, duration = 0.6) => {
    const tl = gsap.timeline()
    tl.to(frontElement, { duration: duration / 2, rotationY: 90 })
      .set(frontElement, { visibility: 'hidden' })
      .set(backElement, { rotationY: -90, visibility: 'visible' })
      .to(backElement, { duration: duration / 2, rotationY: 0 })
    return tl
  }

  const shakeAnimation = (element: string, options = {}) => {
    gsap.to(element, {
      x: 5,
      duration: 0.1,
      repeat: 5,
      yoyo: true,
      ease: 'power1.inOut',
      ...options,
    })
  }

  const bounceIn = (elements: string, options = {}) => {
    gsap.from(elements, {
      scale: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)',
      ...options,
    })
  }

  const rotateIn = (elements: string, options = {}) => {
    gsap.from(elements, {
      rotation: 360,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
      ...options,
    })
  }

  const slideInFromSide = (elements: string, fromRight = true, options = {}) => {
    gsap.from(elements, {
      x: fromRight ? '100%' : '-100%',
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      ...options,
    })
  }

  const textReveal = (element: string, options = {}) => {
    gsap.from(element, {
      clipPath: 'inset(0 100% 0 0)',
      duration: 1,
      ease: 'power4.inOut',
      ...options,
    })
  }

  const pulseAnimation = (element: string, options = {}) => {
    gsap.to(element, {
      scale: 1.05,
      repeat: -1,
      yoyo: true,
      duration: 0.8,
      ease: 'power1.inOut',
      ...options,
    })
  }

  const growWidth = (elements: string, options = {}) => {
    return gsap.from(elements, {
      width: 0,
      duration: 0.5,
      stagger: 0.2,
      ...options,
    })
  }

  const fadeInLeft = (elements: string, options = {}) => {
    return gsap.from(elements, {
      x: -50,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: elements,
        start: 'top bottom-=100px',
        toggleActions: 'play none none reverse',
      },
      ...options,
    })
  }

  const fadeInRight = (elements: string, options = {}) => {
    return gsap.from(elements, {
      x: 50,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: elements,
        start: 'top bottom-=100px',
        toggleActions: 'play none none reverse',
      },
      ...options,
    })
  }

  const scaleIn = (elements: string, options = {}) => {
    return gsap.from(elements, {
      scale: 0.5,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      scrollTrigger: {
        trigger: elements,
        start: 'top bottom-=100px',
        toggleActions: 'play none none reverse',
      },
      ...options,
    })
  }

  onUnmounted(() => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  })

  return {
    fadeInUp,
    carouselFadeIn,
    staggeredFadeIn,
    parallax,
    fadeInScale,
    typewriterEffect,
    flipCard,
    shakeAnimation,
    bounceIn,
    rotateIn,
    slideInFromSide,
    textReveal,
    pulseAnimation,
    scaleOnHover,
    growWidth,
    fadeInLeft,
    fadeInRight,
    scaleIn,
  }
}
