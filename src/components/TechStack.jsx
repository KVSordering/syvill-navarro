import { motion } from 'framer-motion'

const categories = [
  {
    title: 'Frontend',
    items: [
      'HTML',
      'CSS',
      'JavaScript',
      'TypeScript',
      'React',
      'Next.js',
      'Vite',
      'Tailwind CSS',
      'Framer Motion',
    ],
  },
  {
    title: 'Backend',
    items: [
      'Node.js',
      'Express',
      'FastAPI',
      'Python',
      'REST APIs',
      'GraphQL',
      'WebSockets',
    ],
  },
  {
    title: 'Databases & ORM',
    items: [
      'PostgreSQL',
      'MySQL',
      'MongoDB',
      'Redis',
      'Prisma',
      'SQL',
    ],
  },
  {
    title: 'Cloud & Deployment',
    items: [
      'Vercel',
      'Railway',
      'Docker',
      'AWS',
      'GitHub Actions',
      'CI/CD',
      'Nginx',
    ],
  },
  {
    title: 'Auth & Payments',
    items: [
      'JWT',
      'OAuth',
      'NextAuth',
      'bcrypt',
      'Stripe',
      'Webhooks',
    ],
  },
  {
    title: 'Integrations',
    items: [
      'SendGrid',
      'Resend',
      'Twilio',
      'Zapier',
      'CRM APIs',
      'Google APIs',
      'Slack Webhooks',
    ],
  },
  {
    title: 'Dev Tools & Workflow',
    items: [
      'Git',
      'GitHub',
      'Cursor',
      'VS Code',
      'Postman',
      'Figma',
      'ESLint',
      'Vitest',
    ],
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function TechStack() {
  return (
    <section id="stack" className="relative py-24 sm:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-4">Tech Stack</p>
          <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
            Tools I work with
          </h2>
          <p className="text-white/35 mt-4 text-sm font-light max-w-xl mx-auto">
            Technologies commonly used across modern apps and websites — including tools
            I&apos;m actively growing into.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="group relative p-6 sm:p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04] transition-colors duration-500"
            >
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.06)_0%,transparent_70%)]" />
              <h3 className="relative text-sm tracking-[0.2em] uppercase text-white/50 mb-5">
                {cat.title}
              </h3>
              <div className="relative flex flex-wrap gap-2">
                {cat.items.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 text-xs sm:text-sm text-white/60 bg-white/5 rounded-full border border-white/5 group-hover:border-white/10 transition-colors duration-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
