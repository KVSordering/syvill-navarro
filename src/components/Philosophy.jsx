import { motion } from 'framer-motion'

const statements = [
  'Build systems that save time.',
  'Reduce manual work.',
  'Centralize information.',
  'Improve visibility.',
  'Create software people actually use.',
  'Focus on business outcomes, not technical complexity.',
]

export default function Philosophy() {
  return (
    <section className="relative py-24 sm:py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-4">
            Development Philosophy
          </p>
          <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
            How I approach every project
          </h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden sm:block" />

          <div className="space-y-6 sm:space-y-8">
            {statements.map((statement, i) => (
              <motion.div
                key={statement}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`flex ${i % 2 === 0 ? 'sm:justify-start' : 'sm:justify-end'}`}
              >
                <p className="text-lg sm:text-xl md:text-2xl font-light text-white/50 hover:text-white/80 transition-colors duration-500 max-w-md text-center sm:text-left">
                  {statement}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
