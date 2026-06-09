import { motion } from 'framer-motion'

const services = [
  {
    title: 'Business Websites',
    description:
      'Modern responsive websites designed to build credibility and generate leads.',
  },
  {
    title: 'Internal Business Platforms',
    description:
      'Custom systems that replace manual workflows and spreadsheets.',
  },
  {
    title: 'CRM Solutions',
    description: 'Lead management and customer relationship platforms.',
  },
  {
    title: 'Admin Dashboards',
    description:
      'Reporting, analytics, operational visibility, and management tools.',
  },
  {
    title: 'Booking & Scheduling Systems',
    description: 'Online appointment and booking solutions.',
  },
  {
    title: 'E-Commerce & Checkout Systems',
    description:
      'Ordering platforms, pricing engines, and payment integrations.',
  },
  {
    title: 'Workflow Automation',
    description:
      'Automation tools that reduce repetitive administrative work.',
  },
  {
    title: 'API Integrations',
    description:
      'Connecting multiple systems into one streamlined workflow.',
  },
]

export default function Services() {
  return (
    <section id="services" className="relative py-24 sm:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-4">What I Build</p>
          <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
            Solutions for real business needs
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.6,
                delay: (i % 4) * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04] transition-all duration-500 min-h-[200px] flex flex-col"
            >
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="text-xs text-white/25 mb-4 font-mono">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-base font-medium text-white/80 mb-3 group-hover:text-white transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-sm text-white/40 leading-relaxed font-light mt-auto">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
