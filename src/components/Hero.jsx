import { motion } from 'framer-motion'
import MagneticButton from './MagneticButton'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Hero({ revealed }) {
  if (!revealed) return null

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-16">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.04)_0%,transparent_60%)]" />

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.p
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-xs sm:text-sm tracking-[0.3em] uppercase text-white/40 mb-6"
        >
          Full Stack Developer
        </motion.p>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-4xl sm:text-5xl md:text-7xl font-light tracking-tight text-white mb-4"
        >
          Syvill Navarro
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-lg sm:text-xl text-white/50 font-light mb-8"
        >
          Business Systems Builder
        </motion.p>

        <motion.p
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-base sm:text-lg text-white/40 max-w-2xl mx-auto leading-relaxed mb-12 font-light"
        >
          I build websites, internal tools, automation platforms, and business
          systems that help companies operate smarter.
        </motion.p>

        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <MagneticButton href="#work" variant="primary">
            Explore My Work
          </MagneticButton>
          <MagneticButton href="#contact" variant="outline">
            Contact Me
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  )
}
