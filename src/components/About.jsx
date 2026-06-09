import { motion } from 'framer-motion'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

const paragraphs = [
  'I specialize in building practical software solutions that solve real business problems.',
  'My focus is creating systems that reduce manual work, improve workflows, and help companies scale.',
  'From marketing websites to custom business platforms, I build technology that people actually use.',
  'I enjoy transforming spreadsheets, disconnected processes, and manual workflows into centralized systems that provide visibility, accountability, and automation.',
]

export default function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-4">About Me</p>
          <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
            Building systems that matter
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="space-y-8"
        >
          {paragraphs.map((text, i) => (
            <motion.p
              key={i}
              variants={item}
              className="text-base sm:text-lg text-white/45 leading-relaxed font-light"
            >
              {text}
            </motion.p>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
