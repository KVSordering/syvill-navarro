import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const BOOK_HREF = '#book'

export { BOOK_HREF }

export default function MagneticButton({
  children,
  className = '',
  onClick,
  href,
  variant = 'primary',
  ...props
}) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    if (reduce) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setPosition({ x: x * 0.2, y: y * 0.2 })
  }

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 })

  const baseStyles =
    'relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium tracking-wide rounded-xl cursor-pointer transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-accent text-white hover:bg-accent-hover border border-transparent',
    outline:
      'bg-transparent text-ink border border-line hover:border-ink/25 hover:bg-surface',
    ghost: 'bg-transparent text-muted hover:text-ink border border-transparent',
  }

  const motionProps = {
    ref,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    animate: reduce ? undefined : { x: position.x, y: position.y },
    transition: { type: 'spring', stiffness: 350, damping: 25, mass: 0.5 },
    whileTap: reduce ? undefined : { scale: 0.98 },
    className: `${baseStyles} ${variants[variant]} ${className}`,
    ...props,
  }

  if (href) {
    return (
      <motion.a href={href} {...motionProps} onClick={onClick}>
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button type="button" onClick={onClick} {...motionProps}>
      {children}
    </motion.button>
  )
}
