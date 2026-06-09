import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function MagneticButton({
  children,
  className = '',
  onClick,
  href,
  variant = 'primary',
  ...props
}) {
  const ref = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setPosition({ x: x * 0.25, y: y * 0.25 })
  }

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 })

  const baseStyles =
    'relative inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium tracking-wide transition-colors duration-300 rounded-full cursor-pointer'

  const variants = {
    primary:
      'bg-white/5 text-off-white border border-white/10 hover:bg-white/10 hover:border-white/20 backdrop-blur-sm',
    outline:
      'bg-transparent text-off-white border border-white/20 hover:border-white/40 hover:bg-white/5',
    ghost: 'bg-transparent text-muted hover:text-off-white border border-transparent',
  }

  const motionProps = {
    ref,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    animate: { x: position.x, y: position.y },
    transition: { type: 'spring', stiffness: 350, damping: 25, mass: 0.5 },
    whileTap: { scale: 0.97 },
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
