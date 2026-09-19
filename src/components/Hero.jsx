import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import MagneticButton from './MagneticButton'
import HeroPuzzle from './HeroPuzzle'
import { useFadeUp } from '../lib/motion'

function HeroBackdrop() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const ySlow = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -48])
  const yFast = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [12, 56])

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_18%,rgba(107,124,147,0.14)_0%,transparent_52%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_8%_88%,rgba(15,27,45,0.06)_0%,transparent_42%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_92%_12%,rgba(15,27,45,0.05)_0%,transparent_38%)]" />

      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(15,27,45,0.11) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          maskImage:
            'radial-gradient(ellipse at 50% 40%, black 18%, transparent 72%)',
        }}
      />

      <motion.div
        style={{ y: ySlow }}
        className="absolute -top-24 -left-16 w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,rgba(107,124,147,0.22)_0%,transparent_68%)]"
      />
      <motion.div
        style={{ y: yFast }}
        className="absolute -bottom-28 -right-20 w-[460px] h-[460px] rounded-full bg-[radial-gradient(circle,rgba(15,27,45,0.08)_0%,transparent_70%)]"
      />

    </div>
  )
}

export default function Hero() {
  const fadeUp = useFadeUp()
  const item = {
    hidden: fadeUp.hidden,
    visible: (i) => ({
      ...fadeUp.visible,
      transition: fadeUp.visible.transition
        ? { ...fadeUp.visible.transition, delay: i * 0.1 }
        : undefined,
    }),
  }

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center px-5 sm:px-6 pt-28 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
      <HeroBackdrop />
      <HeroPuzzle />

      <div className="relative z-10 max-w-3xl mx-auto text-center pointer-events-none">
        <motion.p
          custom={0}
          initial="hidden"
          animate="visible"
          variants={item}
          className="text-xs tracking-[0.28em] uppercase text-accent mb-5"
        >
          Full Stack Developer
        </motion.p>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={item}
          className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-ink mb-4"
        >
          Syvill Navarro
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={item}
          className="text-lg sm:text-xl text-muted font-medium mb-6"
        >
          Business Systems Builder
        </motion.p>

        <motion.p
          custom={3}
          initial="hidden"
          animate="visible"
          variants={item}
          className="text-base sm:text-lg text-muted leading-relaxed max-w-xl mx-auto mb-10"
        >
          I build websites, internal tools, automation, and business systems that
          help companies operate smarter.
        </motion.p>

        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={item}
          className="pointer-events-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3"
        >
          <MagneticButton href="#work" variant="primary">
            See my work
          </MagneticButton>
          <MagneticButton href="#contact" variant="outline">
            Contact me
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  )
}
