import { motion, useReducedMotion } from 'framer-motion'
import { viewport, useFadeUp, useStagger } from '../lib/motion'

const offerings = [
  {
    title: 'Websites',
    body: 'Clear marketing or product sites that explain what you do and how to reach you.',
  },
  {
    title: 'Ordering portals',
    body: 'Signed-in B2B catalogs with contract pricing, search, cart, and checkout — so dealers place the order themselves.',
  },
  {
    title: 'Member portals',
    body: 'Invite-only login with real roles: directory, map, training, events, and private files instead of a members page plus inboxes.',
  },
  {
    title: 'Dashboards',
    body: 'Sales, KPIs, pipelines, ops — live numbers in one screen, with filters the team actually uses.',
  },
  {
    title: 'Automation & integrations',
    body: 'Connect the ERP, files, and tools you already run so orders, confirmations, and nightly sync move without re-typing.',
  },
  {
    title: 'Internal tools',
    body: 'Admin screens and apps your staff uses day to day instead of shared drives, spreadsheets, and “ask that one person.”',
  },
]

export default function WhatIBuild() {
  const fadeUp = useFadeUp()
  const stagger = useStagger()
  const reduce = useReducedMotion()

  return (
    <section id="what-i-build" className="relative py-8 sm:py-12 px-5 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={fadeUp}
          className="mb-12 sm:mb-16 text-center"
        >
          <p className="text-xs tracking-[0.28em] uppercase text-accent mb-4">What I build</p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-ink tracking-tight">
            Software people actually use
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        >
          {offerings.map((card, i) => (
            <motion.article
              key={card.title}
              variants={fadeUp}
              whileHover={reduce ? undefined : { y: -4, transition: { duration: 0.25 } }}
              className="rounded-2xl border border-line bg-surface p-7 sm:p-8 shadow-card"
            >
              <span className="text-[10px] tracking-[0.22em] uppercase text-accent">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-xl font-semibold text-ink mt-4 mb-3">{card.title}</h3>
              <p className="text-muted leading-relaxed">{card.body}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
