import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import WorkPreview from './WorkPreview'

const projects = [
  {
    title: 'Field Operations Command Center',
    category: 'Internal Platform',
    timeline: '10 weeks',
    scope: 'Ops team · 3 field crews · Office staff',
    problem:
      'Morning dispatch relied on four Google Sheets updated by hand. Crew assignments, job status, and overdue invoices lived in different files — causing missed follow-ups and duplicate data entry.',
    solution:
      'Built a single operations hub with live job boards, crew assignment views, and invoice status flags synced from one database. Office staff update once; field supervisors see changes immediately.',
    description:
      'Central hub for a 12-person home services company managing 140+ weekly jobs across 3 field crews.',
    outcomes: ['140+ jobs/week tracked', '6 hrs/week admin saved', '3 crews unified'],
    tech: ['React', 'Node.js', 'PostgreSQL', 'Railway'],
    preview: 'platform',
  },
  {
    title: 'Service Business Lead Site',
    category: 'Marketing Website',
    timeline: '6 weeks',
    scope: 'Public site · Quote forms · Email alerts',
    problem:
      'An outdated single-page site generated few leads. Quote requests came by phone only, and the team had no visibility into which services visitors cared about most.',
    solution:
      'Launched a mobile-first site with dedicated service pages, a coverage map, and quote forms that trigger instant email alerts. Each form submission logs source page and service type for follow-up.',
    description:
      'Regional HVAC and plumbing company site with service pages, coverage map, and automated lead notifications.',
    outcomes: ['23% more form leads', '8 service pages', '2-min alert delivery'],
    tech: ['Next.js', 'Tailwind CSS', 'Resend', 'Vercel'],
    preview: 'website',
  },
  {
    title: 'Customer Records Admin Portal',
    category: 'Admin Dashboard',
    timeline: '14 weeks',
    scope: '2,400+ records · 5 years of history',
    problem:
      'Customer data was scattered across spreadsheets, paper files, and an old CRM export. Staff spent 20+ minutes locating a single customer\'s full service history before every callback.',
    solution:
      'Migrated five years of records into a searchable admin portal with filters, service timelines, technician notes, and recurring billing flags. Role-based access limits sensitive fields by user type.',
    description:
      'Back-office system for 2,400+ customer profiles with full history, notes, and billing flags.',
    outcomes: ['2,400+ records migrated', '5 yrs history preserved', 'Role-based access'],
    tech: ['React', 'FastAPI', 'MySQL', 'Prisma'],
    preview: 'admin',
  },
  {
    title: 'Invoice Reconciliation Pipeline',
    category: 'Workflow Automation',
    timeline: '8 weeks',
    scope: 'Accounting · Operations · Nightly sync',
    problem:
      'Completed jobs were re-entered manually into accounting spreadsheets every week. Labor rates, material markups, and invoice totals were calculated by hand — 12+ hours of error-prone work.',
    solution:
      'Automated nightly pipeline pulls completed job data, applies rate tables and markup rules, and generates draft invoices for review. Accounting approves instead of rebuilding from scratch.',
    description:
      'Nightly automation from field completion to draft invoice — eliminating duplicate entry between ops and bookkeeping.',
    outcomes: ['12 hrs/week → under 1 hr', 'Nightly auto-sync', 'Zero duplicate entry'],
    tech: ['Python', 'REST APIs', 'PostgreSQL', 'Cron'],
    preview: 'automation',
  },
  {
    title: 'Quote Builder & Deposit Checkout',
    category: 'E-Commerce',
    timeline: '7 weeks',
    scope: 'Sales team · Online quotes · Stripe deposits',
    problem:
      'Quotes were built in email threads with inconsistent pricing. Collecting deposits required separate payment links, and accepted quotes had to be manually re-entered into scheduling.',
    solution:
      'Multi-step quote builder with tiered packages, property-size modifiers, and integrated Stripe deposits. Accepted quotes auto-create scheduling entries and send branded confirmation emails.',
    description:
      'Guided quote flow with tiered packages, dynamic pricing, and deposit collection tied to the job queue.',
    outcomes: ['$18k+/mo processed', '68% deposit completion', 'Auto job queue'],
    tech: ['React', 'Stripe', 'Node.js', 'Webhooks'],
    preview: 'checkout',
  },
]

function ProjectCard({ project, index }) {
  const cardRef = useRef(null)
  const previewRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: '-80px' })
  const previewInView = useInView(previewRef, { once: true, margin: '-40px' })

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  })

  const previewY = useTransform(scrollYProgress, [0, 1], [24, -24])
  const previewScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.98])
  const glowOpacity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 0.6, 0])

  const isEven = index % 2 === 0

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, x: isEven ? -40 : 40, y: 30 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.85,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden hover:border-white/10 transition-colors duration-500"
    >
      <motion.div
        className="absolute -inset-px rounded-2xl bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.08)_0%,transparent_65%)] pointer-events-none"
        style={{ opacity: glowOpacity }}
      />

      <div ref={previewRef} className="relative aspect-[16/10] overflow-hidden border-b border-white/5">
        <motion.div
          style={{ y: previewY, scale: previewScale }}
          className="absolute inset-0"
        >
          <WorkPreview type={project.preview} inView={previewInView} />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50 pointer-events-none" />
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full border border-white/10 bg-black/60 backdrop-blur-sm">
          <span className="text-[10px] tracking-wider uppercase text-white/40">{project.timeline}</span>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="text-xs tracking-[0.2em] uppercase text-white/35">{project.category}</span>
          <span className="text-white/15">·</span>
          <span className="text-xs text-white/30 font-light">{project.scope}</span>
        </div>

        <h3 className="text-lg font-medium text-white/90 mb-4 group-hover:text-white transition-colors">
          {project.title}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/25 mb-2">Challenge</p>
            <p className="text-sm text-white/40 leading-relaxed font-light">{project.problem}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25, duration: 0.6 }}
          >
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/25 mb-2">Solution</p>
            <p className="text-sm text-white/40 leading-relaxed font-light">{project.solution}</p>
          </motion.div>
        </div>

        <p className="text-sm text-white/35 leading-relaxed font-light mb-4 border-l border-white/10 pl-4">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.outcomes.map((outcome, i) => (
            <motion.span
              key={outcome}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3 + i * 0.06, duration: 0.4 }}
              className="text-xs text-white/50 px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.03]"
            >
              {outcome}
            </motion.span>
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
  )
}

export default function SelectedWork() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const lineScale = useTransform(scrollYProgress, [0, 0.4], [0, 1])

  return (
    <section id="work" ref={sectionRef} className="relative py-24 sm:py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
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
          <motion.div
            className="mt-8 h-px bg-white/10 origin-left max-w-xs"
            style={{ scaleX: lineScale }}
          />
        </motion.div>

        <div className="grid grid-cols-1 gap-8">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
