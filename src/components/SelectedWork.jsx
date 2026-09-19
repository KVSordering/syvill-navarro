import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import WorkPreview from './WorkPreview'
import DealerPortalMini from './DealerPortalMini'
import TeamPortalMini from './TeamPortalMini'
import OpsDashboardMini from './OpsDashboardMini'
import { viewport, useFadeUp } from '../lib/motion'

const projects = [
  {
    title: 'Dealer ordering portal',
    timeline: 'Old site / new portal',
    scope: 'Almost 10k SKUs · Contract pricing · Cart · ERP-connected orders',
    problem:
      'The public website could search products, but it could not show what a dealer actually pays or take the order. Pricing and checkout lived on the phone, in email, and in the ERP.',
    built:
      'A signed-in B2B layer around the ERP they already run: almost 10k SKUs with contract pricing on every item, cart and checkout, order history, and a file/SFTP bridge so orders and confirmations move without re-typing.',
    result:
      'Month one added $500k in orders versus the old website. Every month since, it has beaten the old monthly average by $300–400k.',
    metrics: [
      { value: '~10k', label: 'SKUs with live dealer/contract pricing' },
      { value: '$500k', label: 'more in month one vs the old website' },
      { value: '$300–400k', label: 'above the old monthly average, every month since' },
    ],
    compare: [
      { old: 'Keyword catalog, no live dealer price', next: 'Contract price on every SKU' },
      { old: 'No cart — staff placed the order', next: 'Quick add, checkout, order history' },
      { old: 'Website and ERP were separate worlds', next: 'Orders and status sync through the ERP' },
    ],
    preview: 'dealer',
  },
  {
    title: 'Invite-only team portal',
    timeline: 'Invite-only portal',
    scope: 'Directory · Map · Training · Events · Role-based access',
    problem:
      'The Wix members site could not hold training, lender files, events, and a team map in one signed-in place. Everyone got the same door, or the files lived in email.',
    built:
      'An invite-only portal: agents, assistants, lenders, and admins sign in and only see what their role allows. Team directory, live map pins, training and File Friday, events and perks, plus private files behind the login.',
    result:
      'One place for the team instead of a members page plus scattered drives. Lenders get a narrow door; agents get tools; admins approve people without rebuilding access from scratch.',
    metrics: [
      { value: '4 roles', label: 'Agent, assistant, lender, and admin — different doors' },
      { value: 'One login', label: 'Directory, map, training, events, and private files' },
      { value: 'Invite-only', label: 'Replaces the Wix members site' },
    ],
    compare: [
      { old: 'Wix members site', next: 'Signed-in portal with real permissions' },
      { old: 'Lender files in inboxes', next: 'Directory + private downloads' },
      { old: 'No team map', next: 'Pins from member addresses' },
    ],
    preview: 'team',
  },
  {
    title: 'Operations dashboard',
    timeline: 'Accounting · Operations',
    scope: 'Invoices · Exceptions · Filters · Nightly sync',
    problem:
      'Accounting chased mismatches across exports and email. Nobody could see the live picture — how much matched, what was still open, who owned the gap.',
    built:
      'A dashboard that pulls invoices and payments into one view: match rate, dollar gaps, aging, and filters the team actually uses. Nightly sync, exceptions in one queue.',
    result:
      'Less manual chasing. Exceptions have an owner. The numbers for the week sit in one place instead of three spreadsheets.',
    metrics: [
      { value: 'One view', label: 'Matched, gaps, and review in the same screen' },
      { value: 'Filters', label: 'By period, team, vendor, and status' },
      { value: 'Nightly', label: 'Sync so the queue is current in the morning' },
    ],
    preview: 'dash',
  },
]

function ProjectCard({ project, index }) {
  const previewRef = useRef(null)
  const previewInView = useInView(previewRef, { once: true, margin: '-40px' })
  const fadeUp = useFadeUp()
  const reduce = useReducedMotion()

  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={fadeUp}
      transition={{ delay: index * 0.06 }}
      whileHover={
        reduce || project.preview === 'dealer' || project.preview === 'team' || project.preview === 'dash'
          ? undefined
          : { y: -4, transition: { duration: 0.25 } }
      }
      className="group rounded-2xl border border-line bg-surface overflow-hidden shadow-card min-w-0"
    >
      <div
        ref={previewRef}
        className={`relative overflow-hidden border-b border-line ${
          project.preview === 'dealer' || project.preview === 'team' || project.preview === 'dash' ? '' : 'aspect-[16/10]'
        }`}
      >
        {project.preview === 'dealer' ? (
          <DealerPortalMini />
        ) : project.preview === 'team' ? (
          <TeamPortalMini />
        ) : project.preview === 'dash' ? (
          <OpsDashboardMini />
        ) : (
          <WorkPreview type={project.preview} inView={previewInView} />
        )}
        {project.preview !== 'dealer' && project.preview !== 'team' && project.preview !== 'dash' && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full border border-white/10 bg-ink/70 backdrop-blur-sm">
            <span className="text-[10px] tracking-wider uppercase text-white/80">{project.timeline}</span>
          </div>
        )}
      </div>

      <div className="p-6 sm:p-8">
        <p className="text-xs text-muted mb-2">{project.scope}</p>
        <h3 className="text-xl sm:text-2xl font-semibold text-ink mb-6">{project.title}</h3>

        {project.metrics && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {project.metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-line bg-page px-4 py-3"
              >
                <p className="text-2xl font-semibold tracking-tight text-ink">{metric.value}</p>
                <p className="text-xs text-muted mt-1 leading-snug">{metric.label}</p>
              </div>
            ))}
          </div>
        )}

        <dl className="space-y-4">
          <div>
            <dt className="text-[10px] tracking-[0.2em] uppercase text-accent mb-1.5">Problem</dt>
            <dd className="text-sm text-muted leading-relaxed">{project.problem}</dd>
          </div>
          <div>
            <dt className="text-[10px] tracking-[0.2em] uppercase text-accent mb-1.5">What we built</dt>
            <dd className="text-sm text-muted leading-relaxed">{project.built}</dd>
          </div>
          <div>
            <dt className="text-[10px] tracking-[0.2em] uppercase text-accent mb-1.5">Result</dt>
            <dd className="text-sm text-ink leading-relaxed">{project.result}</dd>
          </div>
        </dl>
        {project.compare && (
          <ul className="mt-6 space-y-3 border-t border-line pt-5">
            {project.compare.map((row) => (
              <li
                key={row.old}
                className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-1 sm:gap-3 text-sm"
              >
                <span className="text-muted">{row.old}</span>
                <span className="hidden sm:flex items-center text-accent" aria-hidden="true">
                  →
                </span>
                <span className="text-ink">{row.next}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.article>
  )
}

export default function SelectedWork() {
  const fadeUp = useFadeUp()

  return (
    <section id="work" className="relative py-24 sm:py-32 px-5 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={fadeUp}
          className="mb-12 sm:mb-16 text-center"
        >
          <p className="text-xs tracking-[0.28em] uppercase text-accent mb-4">Selected work</p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-ink tracking-tight">
            Real problems, thinner systems
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted">Try them — they work.</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
