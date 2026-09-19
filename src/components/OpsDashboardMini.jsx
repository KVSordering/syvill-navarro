import { useMemo, useState } from 'react'

const ROWS = [
  { id: 'INV-1847', vendor: 'Northline Supply', team: 'Edmonton', amount: 1240, status: 'matched', week: 3 },
  { id: 'INV-1842', vendor: 'Clearview Pack', team: 'Calgary', amount: 385, status: 'matched', week: 3 },
  { id: 'INV-1839', vendor: 'Harbor Chem', team: 'Edmonton', amount: 2100, status: 'gap', week: 3 },
  { id: 'INV-1835', vendor: 'Apex Steel', team: 'Red Deer', amount: 290, status: 'matched', week: 2 },
  { id: 'INV-1828', vendor: 'Fieldpack Co', team: 'Calgary', amount: 860, status: 'review', week: 2 },
  { id: 'INV-1821', vendor: 'Polar Goods', team: 'Edmonton', amount: 640, status: 'matched', week: 2 },
  { id: 'INV-1814', vendor: 'Northline Supply', team: 'Calgary', amount: 1540, status: 'gap', week: 1 },
  { id: 'INV-1809', vendor: 'Harbor Chem', team: 'Red Deer', amount: 420, status: 'matched', week: 1 },
  { id: 'INV-1802', vendor: 'Apex Steel', team: 'Edmonton', amount: 980, status: 'review', week: 1 },
  { id: 'INV-1794', vendor: 'Clearview Pack', team: 'Edmonton', amount: 175, status: 'matched', week: 0 },
  { id: 'INV-1788', vendor: 'Fieldpack Co', team: 'Calgary', amount: 1320, status: 'gap', week: 0 },
  { id: 'INV-1781', vendor: 'Polar Goods', team: 'Red Deer', amount: 510, status: 'matched', week: 0 },
]

const PERIODS = [
  { id: 1, label: '7 days', weeks: [3] },
  { id: 2, label: '30 days', weeks: [1, 2, 3] },
  { id: 3, label: '90 days', weeks: [0, 1, 2, 3] },
]

const STATUSES = ['all', 'matched', 'gap', 'review']
const TEAMS = ['All teams', 'Edmonton', 'Calgary', 'Red Deer']
const WEEK_LABELS = ['W1', 'W2', 'W3', 'W4']

function money(value) {
  return `$${value.toLocaleString('en-CA', { maximumFractionDigits: 0 })}`
}

function statusTone(status) {
  if (status === 'matched') return 'bg-[#143d2c] text-[#3dd68c]'
  if (status === 'gap') return 'bg-[#3d1a18] text-[#f0a39a]'
  return 'bg-[#3d3214] text-[#e8b84a]'
}

export default function OpsDashboardMini() {
  const [period, setPeriod] = useState(2)
  const [status, setStatus] = useState('all')
  const [team, setTeam] = useState('All teams')
  const [query, setQuery] = useState('')
  const [rows, setRows] = useState(ROWS)
  const [notice, setNotice] = useState('')

  const weeks = PERIODS.find((item) => item.id === period)?.weeks || PERIODS[1].weeks

  const scoped = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (!weeks.includes(row.week)) return false
      if (team !== 'All teams' && row.team !== team) return false
      if (status !== 'all' && row.status !== status) return false
      if (needle && !`${row.id} ${row.vendor} ${row.team}`.toLowerCase().includes(needle)) return false
      return true
    })
  }, [query, rows, status, team, weeks])

  const totals = useMemo(() => {
    const matched = scoped.filter((row) => row.status === 'matched')
    const gaps = scoped.filter((row) => row.status === 'gap')
    const review = scoped.filter((row) => row.status === 'review')
    const matchedSum = matched.reduce((sum, row) => sum + row.amount, 0)
    const gapSum = gaps.reduce((sum, row) => sum + row.amount, 0)
    const allSum = scoped.reduce((sum, row) => sum + row.amount, 0)
    const rate = allSum ? Math.round((matchedSum / allSum) * 100) : 0
    return {
      matchedSum,
      gapSum,
      gapCount: gaps.length,
      reviewCount: review.length,
      rate,
    }
  }, [scoped])

  const bars = useMemo(() => {
    return [0, 1, 2, 3].map((week) => {
      const slice = rows.filter((row) => {
        if (row.week !== week) return false
        if (team !== 'All teams' && row.team !== team) return false
        return true
      })
      const matched = slice.filter((row) => row.status === 'matched').reduce((sum, row) => sum + row.amount, 0)
      const rest = slice.filter((row) => row.status !== 'matched').reduce((sum, row) => sum + row.amount, 0)
      return { week, matched, rest, total: matched + rest }
    })
  }, [rows, team])

  const maxBar = Math.max(...bars.map((bar) => bar.total), 1)

  function cycleStatus(id) {
    setRows((current) =>
      current.map((row) => {
        if (row.id !== id) return row
        const next = row.status === 'gap' ? 'review' : row.status === 'review' ? 'matched' : 'gap'
        return { ...row, status: next }
      }),
    )
    setNotice('Status updated')
    window.setTimeout(() => setNotice(''), 1400)
  }

  function runSync() {
    setRows((current) =>
      current.map((row) => (row.status === 'review' ? { ...row, status: 'matched' } : row)),
    )
    setNotice('Nightly sync ran — review items matched')
    window.setTimeout(() => setNotice(''), 1800)
  }

  return (
    <div
      className="relative h-[min(38rem,78svh)] sm:h-[min(34rem,72vh)] overflow-hidden select-none text-[#e8eef6] bg-[#101822] flex flex-col touch-manipulation"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div className="h-8 flex items-center justify-between px-3 border-b border-[#2a3648] bg-[#0c1219] shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#3dd68c]" />
          <span className="w-2 h-2 rounded-full bg-[#e8b84a]" />
          <span className="w-2 h-2 rounded-full bg-[#e85d4c]" />
          <span className="ml-2 text-[9px] tracking-widest uppercase text-[#8b9bb0] truncate">
            Ops dashboard
          </span>
        </div>
        <button
          type="button"
          onClick={runSync}
          className="h-7 px-2.5 rounded-full text-[10px] font-semibold bg-[#e85d4c] text-white"
        >
          Run sync
        </button>
      </div>

      <div className="px-3 py-2 border-b border-[#2a3648] bg-[#0c1219] flex flex-wrap items-center gap-1.5 shrink-0">
        {PERIODS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setPeriod(item.id)}
            className={`h-8 px-3 rounded-full text-[12px] sm:text-[11px] font-semibold ${
              period === item.id ? 'bg-[#e8eef6] text-[#101822]' : 'text-[#8b9bb0] hover:bg-[#182230]'
            }`}
          >
            {item.label}
          </button>
        ))}
        <select
          value={team}
          onChange={(event) => setTeam(event.target.value)}
          className="h-8 rounded-full border border-[#2a3648] bg-[#182230] px-2 text-base sm:text-[11px] text-[#e8eef6] max-w-full"
        >
          {TEAMS.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search vendor…"
          className="flex-1 min-w-[9rem] w-full h-9 sm:h-7 rounded-full border border-[#2a3648] bg-[#182230] px-3 text-base sm:text-[11px] text-[#e8eef6] placeholder:text-[#8b9bb0] outline-none"
        />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: 'Matched', value: money(totals.matchedSum), tone: 'text-[#3dd68c]' },
            { label: 'Gaps', value: `${totals.gapCount} · ${money(totals.gapSum)}`, tone: 'text-[#f0a39a]' },
            { label: 'In review', value: String(totals.reviewCount), tone: 'text-[#e8b84a]' },
            { label: 'Match rate', value: `${totals.rate}%`, tone: 'text-[#e8eef6]' },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-xl border border-[#2a3648] bg-[#182230] px-3 py-2.5 min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-wide text-[#8b9bb0]">{kpi.label}</p>
              <p className={`text-[15px] sm:text-[16px] font-semibold tracking-tight mt-1 truncate ${kpi.tone}`}>{kpi.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-[#2a3648] bg-[#182230] p-3">
          <p className="text-[9px] font-bold uppercase tracking-wide text-[#8b9bb0] mb-2">Matched vs open</p>
          <div className="flex items-end gap-2 h-20">
            {bars.map((bar, i) => (
              <div key={bar.week} className={`flex-1 flex flex-col justify-end gap-0.5 ${weeks.includes(bar.week) ? 'opacity-100' : 'opacity-30'}`}>
                <div
                  className="rounded-sm bg-[#e85d4c]"
                  style={{ height: `${(bar.rest / maxBar) * 100}%`, minHeight: bar.rest ? 4 : 0 }}
                />
                <div
                  className="rounded-sm bg-[#3dd68c]"
                  style={{ height: `${(bar.matched / maxBar) * 100}%`, minHeight: bar.matched ? 6 : 0 }}
                />
                <p className="text-[8px] text-center text-[#8b9bb0] mt-1">{WEEK_LABELS[i]}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-1 overflow-x-auto pb-0.5 -mx-0.5 px-0.5">
          {STATUSES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setStatus(item)}
              className={`h-8 px-3 rounded-full text-[11px] font-semibold capitalize shrink-0 ${
                status === item ? 'bg-[#e85d4c] text-white' : 'border border-[#2a3648] bg-[#182230] text-[#8b9bb0]'
              }`}
            >
              {item === 'all' ? 'All' : item}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-[#2a3648] bg-[#182230] overflow-hidden">
          <div className="hidden sm:grid grid-cols-[0.7fr_1.2fr_0.7fr_0.6fr] gap-1 px-3 py-1.5 text-[9px] uppercase tracking-wide text-[#8b9bb0] border-b border-[#2a3648]">
            <span>Invoice</span>
            <span>Vendor</span>
            <span>Amount</span>
            <span>Status</span>
          </div>
          {scoped.map((row) => (
            <button
              key={row.id}
              type="button"
              onClick={() => cycleStatus(row.id)}
              className="w-full text-left px-3 py-2.5 border-b border-[#2a3648] last:border-0 hover:bg-[#1e2c3d]"
            >
              <div className="sm:hidden">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-[12px]">{row.id}</span>
                  <span className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${statusTone(row.status)}`}>
                    {row.status}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <span className="truncate text-[11px] text-[#8b9bb0] min-w-0">{row.vendor}</span>
                  <span className="font-semibold text-[12px] shrink-0">{money(row.amount)}</span>
                </div>
              </div>
              <div className="hidden sm:grid grid-cols-[0.7fr_1.2fr_0.7fr_0.6fr] gap-1 text-[11px] items-center">
                <span className="font-semibold">{row.id}</span>
                <span className="truncate text-[#8b9bb0]">
                  {row.vendor}
                  <span className="hidden sm:inline"> · {row.team}</span>
                </span>
                <span className="font-semibold">{money(row.amount)}</span>
                <span className={`justify-self-start text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${statusTone(row.status)}`}>
                  {row.status}
                </span>
              </div>
            </button>
          ))}
          {scoped.length === 0 && (
            <p className="px-3 py-6 text-[12px] text-[#8b9bb0] text-center">Nothing in this filter.</p>
          )}
        </div>
        <p className="text-[10px] text-[#8b9bb0]">Click a row to move it: gap → review → matched.</p>
      </div>

      {notice && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-[#e85d4c] text-white text-[11px] px-3 py-1.5 z-10">
          {notice}
        </div>
      )}
    </div>
  )
}
