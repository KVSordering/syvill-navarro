import { useEffect, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

export default function ParallaxBackground() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const [allowParallax, setAllowParallax] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const update = () => setAllowParallax(mq.matches && !reduce)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [reduce])

  const blobY = useTransform(scrollYProgress, [0, 1], allowParallax ? [30, -120] : [0, 0])
  const blobX = useTransform(scrollYProgress, [0, 1], allowParallax ? [10, -40] : [0, 0])
  const ringRotate = useTransform(scrollYProgress, [0, 1], allowParallax ? [0, 40] : [0, 0])
  const panelY = useTransform(scrollYProgress, [0, 1], allowParallax ? [8, -70] : [0, 0])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <motion.div
        style={{ y: blobY, x: blobX }}
        className="absolute -top-28 -right-20 w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,rgba(107,124,147,0.16)_0%,transparent_68%)]"
      />
      <motion.div
        style={{ y: panelY }}
        className="absolute bottom-[-10%] left-[-8%] w-[380px] h-[380px] rounded-full bg-[radial-gradient(circle,rgba(15,27,45,0.06)_0%,transparent_70%)]"
      />
      <motion.div
        style={{ rotate: ringRotate }}
        className="hidden md:block absolute top-[16%] right-[10%] w-[220px] h-[220px] rounded-full border border-[#0F1B2D]/[0.06]"
      />
    </div>
  )
}
