import { motion } from 'framer-motion'
import { viewport, useFadeUp, useStagger } from '../lib/motion'

const paragraphs = [
  'I build practical software that solves real business problems.',
  'My focus is systems that cut busywork, clean up workflows, and help companies grow without drowning in manual tasks.',
  'That can mean a marketing website, a custom internal platform, or both — software people actually use day to day.',
  'I like turning spreadsheets, scattered processes, and “ask that one person” workflows into one clear system with visibility, ownership, and automation.',
]

export default function About() {
  const fadeUp = useFadeUp()
  const stagger = useStagger()

  return (
    <section id="about" className="relative py-24 sm:py-32 px-5 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={fadeUp}
          className="mb-12 sm:mb-16 text-center"
        >
          <p className="text-xs tracking-[0.28em] uppercase text-accent mb-4">About</p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-ink tracking-tight">
            Building systems that matter
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="space-y-7"
        >
          {paragraphs.map((text) => (
            <motion.p
              key={text}
              variants={fadeUp}
              className="text-base sm:text-lg text-muted leading-relaxed"
            >
              {text}
            </motion.p>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
