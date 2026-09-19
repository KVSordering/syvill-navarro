import { useReducedMotion } from 'framer-motion'

export const ease = [0.22, 1, 0.36, 1]

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease },
  },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.55, ease },
  },
}

export const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.06 },
  },
}

export const viewport = { once: true, margin: '-80px' }

export function useFadeUp() {
  const reduce = useReducedMotion()
  if (reduce) {
    return {
      hidden: { opacity: 1, y: 0 },
      visible: { opacity: 1, y: 0 },
    }
  }
  return fadeUp
}

export function useStagger() {
  const reduce = useReducedMotion()
  if (reduce) {
    return { hidden: {}, visible: {} }
  }
  return stagger
}
