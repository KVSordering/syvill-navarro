import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import MagneticButton from './MagneticButton'
import { viewport, useFadeUp } from '../lib/motion'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function pad(n) {
  return String(n).padStart(2, '0')
}

function monthLabel(year, month) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(
    new Date(year, month - 1, 1),
  )
}

function dateKey(year, month, day) {
  return `${year}-${pad(month)}-${pad(day)}`
}

function formatSlot(iso) {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso))
}

function formatWhen(iso) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(new Date(iso))
}

function monthGrid(year, month) {
  const first = new Date(year, month - 1, 1).getDay()
  const days = new Date(year, month, 0).getDate()
  const cells = []
  for (let i = 0; i < first; i += 1) cells.push(null)
  for (let day = 1; day <= days; day += 1) cells.push(day)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

function downloadIcs(ics) {
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'chat-with-syvill-navarro.ics'
  link.click()
  URL.revokeObjectURL(url)
}

export default function BookingCalendar() {
  const fadeUp = useFadeUp()
  const [now] = useState(() => new Date())
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() + 1 })
  const [days, setDays] = useState({})
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', company: '', note: '' })

  const maxMonth = useMemo(() => {
    const date = new Date(now.getFullYear(), now.getMonth() + 2, 1)
    return { year: date.getFullYear(), month: date.getMonth() + 1 }
  }, [now])

  useEffect(() => {
    let ignore = false
    const month = `${cursor.year}-${pad(cursor.month)}`
    fetch(`/api/availability?month=${month}`)
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Could not load times.')
        return data
      })
      .then((data) => {
        if (ignore) return
        setDays(data.days || {})
        setError('')
      })
      .catch((err) => {
        if (!ignore) setError(err.message)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [cursor.year, cursor.month])

  const cells = monthGrid(cursor.year, cursor.month)
  const slots = selectedDay ? days[selectedDay] || [] : []
  const canPrev =
    cursor.year > now.getFullYear() ||
    (cursor.year === now.getFullYear() && cursor.month > now.getMonth() + 1)
  const canNext =
    cursor.year < maxMonth.year || (cursor.year === maxMonth.year && cursor.month < maxMonth.month)

  function shiftMonth(delta) {
    const date = new Date(cursor.year, cursor.month - 1 + delta, 1)
    setLoading(true)
    setCursor({ year: date.getFullYear(), month: date.getMonth() + 1 })
    setSelectedDay(null)
    setSelectedSlot(null)
  }

  async function onSubmit(event) {
    event.preventDefault()
    if (!selectedSlot) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, start: selectedSlot.start }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not book that time.')
      setDone(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div
      id="book"
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={fadeUp}
      className="scroll-mt-24 rounded-2xl border border-line bg-surface shadow-card overflow-hidden text-left"
    >
      {done ? (
        <div className="p-6 sm:p-8 text-center">
          <p className="text-xs tracking-[0.28em] uppercase text-accent mb-4">Booked</p>
          <h3 className="text-2xl font-semibold text-ink mb-3">You’re on the calendar</h3>
          <p className="text-muted leading-relaxed mb-6">
            {formatWhen(done.start)}
            {done.emailed
              ? '. A Gmail invite is on its way — add it to your calendar from the email.'
              : '. Download the invite below if you want it on your calendar right now.'}
          </p>
          {done.ics && (
            <MagneticButton type="button" variant="primary" onClick={() => downloadIcs(done.ics)}>
              Download calendar invite
            </MagneticButton>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-line">
            <div className="flex items-center justify-between gap-3 mb-5">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                disabled={!canPrev}
                className="rounded-xl border border-line px-3 py-1.5 text-sm text-ink disabled:text-muted/40 disabled:cursor-not-allowed hover:border-ink/20"
                aria-label="Previous month"
              >
                ←
              </button>
              <p className="text-sm font-medium text-ink">{monthLabel(cursor.year, cursor.month)}</p>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                disabled={!canNext}
                className="rounded-xl border border-line px-3 py-1.5 text-sm text-ink disabled:text-muted/40 disabled:cursor-not-allowed hover:border-ink/20"
                aria-label="Next month"
              >
                →
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {WEEKDAYS.map((day) => (
                <p key={day} className="text-center text-[10px] tracking-[0.18em] uppercase text-muted py-1">
                  {day}
                </p>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (!day) return <div key={`e-${i}`} />
                const key = dateKey(cursor.year, cursor.month, day)
                const open = (days[key] || []).length > 0
                const selected = selectedDay === key
                const isToday =
                  cursor.year === now.getFullYear() &&
                  cursor.month === now.getMonth() + 1 &&
                  day === now.getDate()
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={!open}
                    onClick={() => {
                      setSelectedDay(key)
                      setSelectedSlot(null)
                    }}
                    className={`aspect-square rounded-xl text-sm transition-colors ${
                      selected
                        ? 'bg-accent text-white'
                        : open
                          ? 'text-ink hover:bg-page'
                          : 'text-muted/35 cursor-not-allowed'
                    } ${isToday && !selected ? 'ring-1 ring-ink/20' : ''}`}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
            <p className="mt-4 text-xs text-muted">
              30-minute chats. Open times follow Mountain Time; slots show in your timezone.
            </p>
          </div>

          <div className="p-6 sm:p-8 bg-page/60">
            {!selectedDay && (
              <p className="text-sm text-muted">Pick a day to see live openings.</p>
            )}
            {selectedDay && (
              <>
                <p className="text-[10px] tracking-[0.22em] uppercase text-muted mb-3">Available times</p>
                {loading ? (
                  <p className="text-sm text-muted">Checking the calendar…</p>
                ) : slots.length === 0 ? (
                  <p className="text-sm text-muted">No openings this day.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {slots.map((slot) => {
                      const active = selectedSlot?.start === slot.start
                      return (
                        <button
                          key={slot.start}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                            active
                              ? 'border-accent bg-accent text-white'
                              : 'border-line bg-surface text-ink hover:border-ink/20'
                          }`}
                        >
                          {formatSlot(slot.start)}
                        </button>
                      )
                    })}
                  </div>
                )}

                {selectedSlot && (
                  <form onSubmit={onSubmit} className="space-y-3">
                    <p className="text-sm text-ink font-medium">{formatWhen(selectedSlot.start)}</p>
                    <label className="block">
                      <span className="sr-only">Name</span>
                      <input
                        required
                        name="name"
                        autoComplete="name"
                        placeholder="Your name"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-muted/70"
                      />
                    </label>
                    <label className="block">
                      <span className="sr-only">Email</span>
                      <input
                        required
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder="Work email"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-muted/70"
                      />
                    </label>
                    <label className="block">
                      <span className="sr-only">Company</span>
                      <input
                        name="company"
                        autoComplete="organization"
                        placeholder="Company (optional)"
                        value={form.company}
                        onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                        className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-muted/70"
                      />
                    </label>
                    <label className="block">
                      <span className="sr-only">Note</span>
                      <textarea
                        name="note"
                        rows={3}
                        placeholder="What do you want to talk about?"
                        value={form.note}
                        onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                        className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-muted/70 resize-none"
                      />
                    </label>
                    <MagneticButton type="submit" variant="primary" className="w-full" disabled={submitting}>
                      {submitting ? 'Booking…' : 'Book this time'}
                    </MagneticButton>
                  </form>
                )}
              </>
            )}
            {error && <p className="mt-4 text-sm text-accent">{error}</p>}
          </div>
        </div>
      )}
    </motion.div>
  )
}
