import { motion } from 'framer-motion'

const projects = [
  {
    title: 'Field Operations Command Center',
    category: 'Internal Platform',
    description:
      'Central hub for a 12-person home services company managing 140+ weekly jobs across 3 field crews. Replaced four Google Sheets that were manually updated every morning with live job status, crew assignments, and overdue invoice flags.',
    outcomes: ['140+ jobs/week tracked', '6 hrs/week admin saved', '3 crews unified'],
    tech: ['React', 'Node.js', 'PostgreSQL', 'Railway'],
    image: '/images/work/platform.svg',
  },
  {
    title: 'Service Business Lead Site',
    category: 'Marketing Website',
    description:
      'Full marketing site for a regional HVAC and plumbing company — service area coverage map, emergency contact CTA, and quote request forms with automatic email alerts to the office within 2 minutes of submission.',
    outcomes: ['23% more form leads', '8 service pages', 'Mobile-first build'],
    tech: ['Next.js', 'Tailwind CSS', 'Resend', 'Vercel'],
    image: '/images/work/website.svg',
  },
  {
    title: 'Customer Records Admin Portal',
    category: 'Admin Dashboard',
    description:
      'Back-office system to search, filter, and manage 2,400+ customer profiles with full service history, technician notes, and recurring billing flags. Role-based views separate office staff from field supervisors.',
    outcomes: ['2,400+ records migrated', '5 yrs history preserved', 'Role-based access'],
    tech: ['React', 'FastAPI', 'MySQL', 'Prisma'],
    image: '/images/work/admin.svg',
  },
  {
    title: 'Invoice Reconciliation Pipeline',
    category: 'Workflow Automation',
    description:
      'Nightly automation pulls completed job data from the field system, applies labor rates and material markups, and generates draft invoices for accounting review. Cut duplicate entry between operations and bookkeeping entirely.',
    outcomes: ['12 hrs/week → under 1 hr', 'Nightly auto-sync', 'Zero duplicate entry'],
    tech: ['Python', 'REST APIs', 'PostgreSQL', 'Cron'],
    image: '/images/work/automation.svg',
  },
  {
    title: 'Quote Builder & Deposit Checkout',
    category: 'E-Commerce',
    description:
      'Multi-step quote flow with tiered service packages, property-size pricing modifiers, and Stripe deposit collection. Sends branded confirmation emails and pushes accepted quotes directly into the job scheduling queue.',
    outcomes: ['$18k+/mo processed', '68% deposit completion', 'Auto job queue'],
    tech: ['React', 'Stripe', 'Node.js', 'Webhooks'],
    image: '/images/work/checkout.svg',
  },
]

export default function SelectedWork() {
  return (
    <section id="work" className="relative py-24 sm:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-4">Selected Work</p>
          <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
            Capabilities in practice
          </h2>
          <p className="text-white/35 mt-4 text-sm font-light max-w-lg">
            Representative project scenarios — names and identifying details omitted.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.7,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -6 }}
              className="group relative rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden hover:border-white/10 transition-colors duration-500"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-black">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
              </div>

              <div className="p-6 sm:p-8">
                <span className="text-xs tracking-[0.2em] uppercase text-white/35">
                  {project.category}
                </span>
                <h3 className="text-lg font-medium text-white/90 mt-2 mb-3 group-hover:text-white transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-white/40 leading-relaxed font-light mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.outcomes.map((outcome) => (
                    <span
                      key={outcome}
                      className="text-xs text-white/50 px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.03]"
                    >
                      {outcome}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs text-white/35 px-2.5 py-1 rounded-full border border-white/5"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
