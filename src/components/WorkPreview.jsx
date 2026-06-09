import { motion } from 'framer-motion'

const fade = {
  hidden: { opacity: 0, y: 8 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
}

function PreviewShell({ children, label, actions }) {
  return (
    <div className="relative w-full h-full bg-[#0a0a0a] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(255,255,255,0.07)_0%,transparent_50%)]" />
      <div className="absolute top-0 left-0 right-0 h-8 flex items-center justify-between px-3 border-b border-white/10 bg-black/70">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-white/25" />
          <span className="w-2 h-2 rounded-full bg-white/15" />
          <span className="w-2 h-2 rounded-full bg-white/10" />
          <span className="ml-2 text-[9px] tracking-widest uppercase text-white/35">{label}</span>
        </div>
        {actions && <div className="flex items-center gap-1.5">{actions}</div>}
      </div>
      <div className="absolute inset-0 top-8 p-2.5 sm:p-3">{children}</div>
    </div>
  )
}

function Kpi({ label, value, accent, delay, delta }) {
  return (
    <motion.div custom={delay} variants={fade} className="rounded-md border border-white/10 bg-white/[0.04] p-2">
      <p className="text-[8px] uppercase tracking-wider text-white/30 mb-0.5">{label}</p>
      <div className="flex items-end justify-between gap-1">
        <p className={`text-base sm:text-lg font-light leading-none ${accent || 'text-white/85'}`}>{value}</p>
        {delta && <span className="text-[8px] text-emerald-400/70">{delta}</span>}
      </div>
    </motion.div>
  )
}

function StatusPill({ children, tone = 'green' }) {
  const tones = {
    green: 'bg-emerald-500/15 text-emerald-300/80 border-emerald-500/25',
    amber: 'bg-amber-500/15 text-amber-300/80 border-amber-500/25',
    blue: 'bg-sky-500/15 text-sky-300/80 border-sky-500/25',
    red: 'bg-red-500/15 text-red-300/80 border-red-500/25',
  }
  return (
    <span className={`text-[8px] px-1.5 py-0.5 rounded-full border whitespace-nowrap ${tones[tone]}`}>
      {children}
    </span>
  )
}

function MiniBar({ pct, tone = 'white' }) {
  const fill = { white: 'bg-white/40', amber: 'bg-amber-400/60', green: 'bg-emerald-400/60' }
  return (
    <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
      <div className={`h-full rounded-full ${fill[tone]}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

function Sparkline({ delay }) {
  return (
    <motion.div custom={delay} variants={fade} className="flex items-end gap-0.5 h-6">
      {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
        <div key={i} className="w-1 bg-white/25 rounded-sm" style={{ height: `${h}%` }} />
      ))}
    </motion.div>
  )
}

function ToolbarButton({ children, active }) {
  return (
    <span
      className={`text-[8px] px-2 py-1 rounded border ${
        active
          ? 'bg-white/10 border-white/20 text-white/70'
          : 'border-white/10 text-white/35 bg-transparent'
      }`}
    >
      {children}
    </span>
  )
}

export function PlatformPreview({ inView }) {
  const anim = inView ? 'visible' : 'hidden'
  const rows = [
    ['HVAC Install — Unit 4B', 'Crew A', 'In Progress', 'amber', '72%', 'Today'],
    ['Pipe Repair — Oak St', 'Crew B', 'Complete', 'green', '100%', 'Done'],
    ['Annual Service — Elm Ave', 'Crew C', 'Scheduled', 'blue', '0%', 'Fri'],
    ['Duct Cleaning — Pine Rd', 'Crew A', 'Queued', 'blue', '0%', 'Mon'],
  ]

  return (
    <PreviewShell
      label="Operations Hub"
      actions={
        <>
          <span className="text-[8px] px-2 py-0.5 rounded border border-white/15 text-white/40">+ New Job</span>
          <span className="w-5 h-5 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-[8px] text-white/40">⚙</span>
        </>
      }
    >
      <motion.div initial="hidden" animate={anim} className="h-full flex gap-2">
        <motion.div variants={fade} custom={0} className="hidden sm:flex w-[72px] shrink-0 flex-col gap-1 rounded-md border border-white/10 bg-black/50 p-1.5">
          {['Dashboard', 'Jobs', 'Crews', 'Invoices'].map((item, i) => (
            <span
              key={item}
              className={`text-[7px] px-1.5 py-1 rounded ${
                i === 1 ? 'bg-white/10 text-white/60' : 'text-white/30'
              }`}
            >
              {item}
            </span>
          ))}
          <div className="mt-auto pt-1 border-t border-white/10">
            <MiniBar pct={68} tone="green" />
            <p className="text-[7px] text-white/25 mt-1">Capacity 68%</p>
          </div>
        </motion.div>

        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <motion.div variants={fade} custom={1} className="flex gap-1.5 items-center">
            <div className="flex-1 h-6 rounded border border-white/10 bg-white/[0.03] px-2 flex items-center">
              <span className="text-[8px] text-white/25">Search jobs, crews, addresses…</span>
            </div>
            <ToolbarButton active>Today</ToolbarButton>
            <ToolbarButton>Week</ToolbarButton>
          </motion.div>

          <div className="grid grid-cols-4 gap-1.5">
            <Kpi label="Active" value="142" delta="+12" delay={2} />
            <Kpi label="Crews" value="3" delay={3} />
            <Kpi label="Overdue" value="7" accent="text-amber-400/90" delta="−2" delay={4} />
            <Kpi label="Revenue" value="$48k" delta="+8%" delay={5} />
          </div>

          <motion.div variants={fade} custom={6} className="flex-1 rounded-md border border-white/10 bg-black/40 overflow-hidden flex flex-col min-h-0">
            <div className="flex items-center justify-between px-2 py-1.5 border-b border-white/5">
              <span className="text-[8px] text-white/40 uppercase tracking-wider">Live Job Board</span>
              <div className="flex gap-1">
                <ToolbarButton active>All</ToolbarButton>
                <ToolbarButton>Urgent</ToolbarButton>
              </div>
            </div>
            <div className="grid grid-cols-[1.4fr_0.6fr_0.7fr_0.5fr_0.5fr] gap-1 px-2 py-1 border-b border-white/5 text-[7px] uppercase tracking-wider text-white/20">
              <span>Job</span><span>Crew</span><span>Status</span><span>Progress</span><span>Due</span>
            </div>
            <div className="flex-1 overflow-hidden">
              {rows.map(([job, crew, status, tone, pct, due], i) => (
                <motion.div
                  key={job}
                  custom={7 + i}
                  variants={fade}
                  className="grid grid-cols-[1.4fr_0.6fr_0.7fr_0.5fr_0.5fr] gap-1 px-2 py-1.5 border-b border-white/5 text-[9px] text-white/50 items-center"
                >
                  <span className="truncate">{job}</span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-white/10 border border-white/15" />
                    {crew}
                  </span>
                  <span><StatusPill tone={tone}>{status}</StatusPill></span>
                  <MiniBar pct={parseInt(pct)} tone={tone === 'amber' ? 'amber' : tone === 'green' ? 'green' : 'white'} />
                  <span className="text-white/30">{due}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </PreviewShell>
  )
}

export function WebsitePreview({ inView }) {
  const anim = inView ? 'visible' : 'hidden'
  const services = [
    { name: 'HVAC Repair', price: 'From $149', rating: '4.9', image: '/images/work/hvac.jpg', alt: 'HVAC repair' },
    { name: 'Plumbing', price: 'From $129', rating: '4.8', image: '/images/work/plumbing.jpg', alt: 'Plumbing' },
    { name: 'Emergency', price: 'From $199', rating: '5.0', image: '/images/work/emergency.jpg', alt: 'Emergency service' },
  ]

  return (
    <PreviewShell
      label="Service Site"
      actions={<span className="text-[8px] text-emerald-400/70">● Live</span>}
    >
      <motion.div initial="hidden" animate={anim} className="h-full flex flex-col gap-2">
        <motion.div variants={fade} custom={0} className="flex items-center justify-between px-1">
          <span className="text-[10px] font-light text-white/70">HomeServe Pro</span>
          <div className="flex gap-2 text-[8px] text-white/30">
            <span>Services</span><span>Areas</span><span>Reviews</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/60 border border-white/10">Quote</span>
          </div>
        </motion.div>

        <motion.div variants={fade} custom={1} className="text-center py-1 px-2 rounded-md border border-white/5 bg-white/[0.02]">
          <p className="text-xs sm:text-sm font-light text-white/85">24/7 Home Services</p>
          <p className="text-[8px] text-white/35 mt-0.5">Serving 6 counties · Same-day emergency available</p>
          <div className="flex justify-center gap-1.5 mt-1.5">
            <span className="text-[8px] px-2.5 py-1 rounded-full bg-white/10 text-white/70 border border-white/15">Get a Quote</span>
            <span className="text-[8px] px-2.5 py-1 rounded-full border border-white/15 text-white/40">(555) 482-0194</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-1.5 flex-1 min-h-0">
          {services.map((s, i) => (
            <motion.div
              key={s.name}
              custom={2 + i}
              variants={fade}
              className="rounded-md border border-white/10 bg-white/[0.02] overflow-hidden flex flex-col min-h-0 group"
            >
              <div className="relative flex-1 min-h-[64px] overflow-hidden">
                <img src={s.image} alt={s.alt} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <span className="absolute top-1 right-1 text-[7px] px-1 py-0.5 rounded bg-black/60 text-amber-300/80 border border-amber-500/20">
                  ★ {s.rating}
                </span>
              </div>
              <div className="p-1.5 shrink-0">
                <p className="text-[8px] text-white/70">{s.name}</p>
                <div className="flex justify-between items-center mt-0.5">
                  <p className="text-[7px] text-white/35">{s.price}</p>
                  <span className="text-[7px] px-1.5 py-0.5 rounded bg-white/10 text-white/50">Book</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fade} custom={5} className="grid grid-cols-2 gap-1.5">
          <div className="rounded-md border border-emerald-500/20 bg-emerald-500/5 px-2 py-1.5 flex justify-between items-center">
            <span className="text-[8px] text-emerald-300/70">New lead — HVAC quote</span>
            <span className="text-[7px] text-white/30">2m ago</span>
          </div>
          <div className="rounded-md border border-white/10 bg-white/[0.02] px-2 py-1.5 flex items-center gap-1.5">
            <span className="text-[8px] text-white/40">"Fast response, great service."</span>
            <span className="text-[7px] text-white/25 ml-auto">★★★★★</span>
          </div>
        </motion.div>
      </motion.div>
    </PreviewShell>
  )
}

export function AdminPreview({ inView }) {
  const anim = inView ? 'visible' : 'hidden'
  const customers = [
    ['Martinez', '14 visits', 'Active', 'green', '$2,840'],
    ['Chen', 'Annual plan', 'Recurring', 'blue', '$960/yr'],
    ['Rivera', 'Payment due', 'Overdue', 'amber', '$385'],
    ['Thompson', 'New lead', 'Pending', 'blue', '—'],
  ]

  return (
    <PreviewShell
      label="Customer Portal"
      actions={
        <>
          <span className="text-[8px] px-2 py-0.5 rounded border border-white/15 text-white/40">Export</span>
          <span className="text-[8px] px-2 py-0.5 rounded bg-white/10 border border-white/20 text-white/50">+ Add</span>
        </>
      }
    >
      <motion.div initial="hidden" animate={anim} className="h-full flex flex-col gap-2">
        <div className="grid grid-cols-4 gap-1.5">
          <Kpi label="Customers" value="2,412" delta="+18" delay={0} />
          <Kpi label="Active" value="847" delay={1} />
          <Kpi label="Overdue" value="63" accent="text-amber-400/90" delay={2} />
          <div className="rounded-md border border-white/10 bg-white/[0.04] p-2">
            <p className="text-[8px] uppercase tracking-wider text-white/30 mb-0.5">Retention</p>
            <p className="text-base font-light text-emerald-400/90">94%</p>
            <Sparkline delay={3} />
          </div>
        </div>

        <motion.div variants={fade} custom={4} className="flex gap-1.5 items-center">
          <div className="flex-1 h-6 rounded border border-white/10 bg-white/[0.03] px-2 flex items-center justify-between">
            <span className="text-[8px] text-white/25">Search name, phone, address…</span>
            <span className="text-[8px] text-white/20">⌕</span>
          </div>
          <ToolbarButton active>All</ToolbarButton>
          <ToolbarButton>Recurring</ToolbarButton>
          <ToolbarButton>Flagged</ToolbarButton>
        </motion.div>

        <motion.div variants={fade} custom={5} className="flex-1 rounded-md border border-white/10 bg-black/40 overflow-hidden flex flex-col min-h-0">
          <div className="grid grid-cols-[1.2fr_0.8fr_0.7fr_0.6fr] gap-1 px-2 py-1.5 border-b border-white/5 text-[7px] uppercase tracking-wider text-white/20">
            <span>Customer</span><span>History</span><span>Status</span><span>Balance</span>
          </div>
          {customers.map(([name, history, status, tone, balance], i) => (
            <motion.div
              key={name}
              custom={6 + i}
              variants={fade}
              className="grid grid-cols-[1.2fr_0.8fr_0.7fr_0.6fr] gap-1 px-2 py-1.5 border-b border-white/5 text-[9px] items-center"
            >
              <span className="flex items-center gap-1 text-white/55">
                <span className="w-3 h-3 rounded-full bg-white/10 shrink-0" />
                {name}
              </span>
              <span className="text-white/35">{history}</span>
              <StatusPill tone={tone}>{status}</StatusPill>
              <span className="text-white/50">{balance}</span>
            </motion.div>
          ))}
          <div className="mt-auto flex items-center justify-between px-2 py-1 border-t border-white/5 text-[7px] text-white/25">
            <span>Showing 1–4 of 2,412</span>
            <div className="flex gap-1">
              <span className="px-1.5 py-0.5 rounded border border-white/10">‹</span>
              <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15">1</span>
              <span className="px-1.5 py-0.5 rounded border border-white/10">›</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </PreviewShell>
  )
}

export function AutomationPreview({ inView }) {
  const anim = inView ? 'visible' : 'hidden'
  const steps = [
    { name: 'Field App', status: 'done', count: '47 jobs' },
    { name: 'Rate Engine', status: 'done', count: 'Applied' },
    { name: 'Draft Invoice', status: 'active', count: '34 ready' },
    { name: 'Accounting', status: 'pending', count: 'Awaiting' },
  ]

  return (
    <PreviewShell
      label="Invoice Pipeline"
      actions={<span className="text-[8px] px-2 py-0.5 rounded border border-emerald-500/30 text-emerald-400/70 bg-emerald-500/5">Cron 2:00 AM</span>}
    >
      <motion.div initial="hidden" animate={anim} className="h-full flex flex-col gap-2">
        <div className="flex items-center gap-1">
          {steps.map((step, i) => (
            <motion.div key={step.name} custom={i} variants={fade} className="flex-1 flex items-center gap-0.5 min-w-0">
              <div
                className={`flex-1 rounded-md border p-1.5 text-center min-w-0 ${
                  step.status === 'active'
                    ? 'border-sky-500/30 bg-sky-500/5'
                    : step.status === 'done'
                      ? 'border-emerald-500/20 bg-emerald-500/5'
                      : 'border-white/10 bg-white/[0.02]'
                }`}
              >
                <p className="text-[7px] text-white/45 truncate">{step.name}</p>
                <p className="text-[8px] text-white/60 mt-0.5">{step.count}</p>
                {step.status === 'done' && <span className="text-[7px] text-emerald-400/70">✓</span>}
              </div>
              {i < steps.length - 1 && <span className="text-white/15 text-[8px] shrink-0">→</span>}
            </motion.div>
          ))}
        </div>

        <motion.div variants={fade} custom={4} className="rounded-md border border-white/10 bg-black/50 p-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[8px] text-white/40">Batch progress</span>
            <span className="text-[8px] text-emerald-400/70">34 / 47 processed</span>
          </div>
          <MiniBar pct={72} tone="green" />
        </motion.div>

        <motion.div variants={fade} custom={5} className="flex-1 rounded-md border border-white/10 bg-black/40 overflow-hidden flex flex-col min-h-0">
          <div className="flex items-center justify-between px-2 py-1.5 border-b border-white/5">
            <span className="text-[8px] text-white/40 uppercase tracking-wider">Draft Invoices</span>
            <div className="flex gap-1">
              <span className="text-[7px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400/70 border border-emerald-500/20">Approve All</span>
              <span className="text-[7px] px-1.5 py-0.5 rounded border border-white/10 text-white/35">Review</span>
            </div>
          </div>
          {[
            ['#1847', 'Martinez — Labor + materials', '$1,240', 'ready'],
            ['#1842', 'Chen — Service call', '$385', 'ready'],
            ['#1839', 'Rivera — Install deposit', '$2,100', 'flagged'],
            ['#1835', 'Thompson — Maintenance', '$290', 'ready'],
          ].map(([id, label, amt, state], i) => (
            <motion.div
              key={id}
              custom={6 + i}
              variants={fade}
              className="grid grid-cols-[0.5fr_1.4fr_0.6fr_0.5fr] gap-1 px-2 py-1.5 border-b border-white/5 text-[9px] items-center"
            >
              <span className="text-white/30">{id}</span>
              <span className="text-white/45 truncate">{label}</span>
              <span className="text-white/70">{amt}</span>
              <StatusPill tone={state === 'flagged' ? 'amber' : 'green'}>{state}</StatusPill>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fade} custom={10} className="rounded border border-white/5 bg-black/60 px-2 py-1 font-mono text-[7px] text-white/30">
          <span className="text-emerald-400/60">[02:00:14]</span> Synced 47 records · 0 errors · 13 skipped
        </motion.div>
      </motion.div>
    </PreviewShell>
  )
}

export function CheckoutPreview({ inView }) {
  const anim = inView ? 'visible' : 'hidden'

  return (
    <PreviewShell
      label="Quote Checkout"
      actions={<span className="text-[8px] text-white/30">🔒 Secure</span>}
    >
      <motion.div initial="hidden" animate={anim} className="h-full flex flex-col gap-2">
        <motion.div variants={fade} custom={0} className="flex items-center gap-1.5">
          {['Package', 'Details', 'Deposit'].map((step, i) => (
            <div key={step} className="flex items-center gap-1 flex-1">
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[7px] border ${
                  i <= 2 ? 'bg-white/10 border-white/25 text-white/60' : 'border-white/10 text-white/25'
                }`}
              >
                {i + 1}
              </span>
              <span className={`text-[8px] ${i === 2 ? 'text-white/70' : 'text-white/30'}`}>{step}</span>
              {i < 2 && <span className="flex-1 h-px bg-white/10 mx-0.5" />}
            </div>
          ))}
        </motion.div>

        <motion.div variants={fade} custom={1} className="grid grid-cols-3 gap-1.5">
          {[
            { name: 'Standard', price: '$499', perks: '1 system' },
            { name: 'Premium', price: '$849', perks: '2 systems', selected: true },
            { name: 'Full', price: '$1,240', perks: 'Whole home' },
          ].map((pkg, i) => (
            <div
              key={pkg.name}
              className={`rounded-md border p-1.5 text-center ${
                pkg.selected ? 'border-sky-500/35 bg-sky-500/5 ring-1 ring-sky-500/20' : 'border-white/10 bg-white/[0.02]'
              }`}
            >
              <p className="text-[8px] text-white/55">{pkg.name}</p>
              <p className="text-sm text-white/80 mt-0.5">{pkg.price}</p>
              <p className="text-[7px] text-white/30 mt-0.5">{pkg.perks}</p>
            </div>
          ))}
        </motion.div>

        <motion.div variants={fade} custom={2} className="rounded-md border border-white/10 bg-black/40 p-2 space-y-1.5 flex-1 flex flex-col min-h-0">
          <div className="flex justify-between text-[8px] text-white/35">
            <span>Property size</span>
            <span>2,400 sq ft (+20%)</span>
          </div>
          <MiniBar pct={60} />
          <div className="space-y-1 text-[9px] pt-1">
            <div className="flex justify-between text-white/40"><span>Premium package</span><span>$849</span></div>
            <div className="flex justify-between text-white/40"><span>Large property modifier</span><span>$170</span></div>
            <div className="flex justify-between text-white/40"><span>Duct cleaning add-on</span><span>$221</span></div>
            <div className="flex justify-between text-white/25 text-[8px]"><span>Discount code APPLIED10</span><span>−$0</span></div>
          </div>
          <div className="mt-auto space-y-1.5">
            <div className="border-t border-white/10 pt-1.5 flex justify-between items-center">
              <span className="text-[9px] text-white/50">Deposit due today (50%)</span>
              <span className="text-base text-white/90 font-light">$620</span>
            </div>
            <div className="flex gap-1.5">
              <span className="flex-1 text-center text-[8px] py-1.5 rounded-md bg-white/10 text-white/75 border border-white/15">
                Pay with Stripe
              </span>
              <span className="text-[8px] py-1.5 px-2 rounded-md border border-white/10 text-white/35">Save quote</span>
            </div>
            <p className="text-[7px] text-center text-white/25">Confirmation emailed · Job queued on payment</p>
          </div>
        </motion.div>
      </motion.div>
    </PreviewShell>
  )
}

const previews = {
  platform: PlatformPreview,
  website: WebsitePreview,
  admin: AdminPreview,
  automation: AutomationPreview,
  checkout: CheckoutPreview,
}

export default function WorkPreview({ type, inView }) {
  const Preview = previews[type]
  return Preview ? <Preview inView={inView} /> : null
}
