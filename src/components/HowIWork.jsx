import { motion, useReducedMotion } from 'framer-motion'
import { viewport, useFadeUp, useStagger } from '../lib/motion'

const lines = [
  'Build systems that save time.',
  'Cut manual work.',
  'Put information in one place.',
  'Make it easy to see what’s going on.',
  'Ship software people actually use.',
  'Care about business results more than fancy tech.',
]

export default function HowIWork() {
  const fadeUp = useFadeUp()
  const stagger = useStagger()
  const reduce = useReducedMotion()

  return (
    <section className="relative py-24 sm:py-32 px-5 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={fadeUp}
          className="mb-12 sm:mb-16 text-center"
        >
          <p className="text-xs tracking-[0.28em] uppercase text-accent mb-4">How I work</p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-ink tracking-tight">
            Simple rules. Useful software.
          </h2>
        </motion.div>

        <motion.ul
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {lines.map((line, i) => (
            <motion.li
              key={line}
              variants={fadeUp}
              whileHover={reduce ? undefined : { y: -3, transition: { duration: 0.25 } }}
              className="rounded-2xl border border-line bg-surface px-5 py-5 shadow-card"
            >
              <span className="text-[10px] tracking-[0.22em] uppercase text-accent">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="mt-2 text-base sm:text-lg text-ink leading-snug">{line}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
