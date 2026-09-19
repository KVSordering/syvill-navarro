import { randomBytes, timingSafeEqual } from 'node:crypto'
import { Router } from 'express'
import { getConfig, saveConfig } from './config.js'
import { findSlot, listOpenSlots, monthBounds } from './slots.js'
import { cancelBooking, createBooking, listBookedStarts, listBookings } from './store.js'
import { buildInvite, sendBookingMail } from './mail.js'

const router = Router()
const hits = new Map()
const tokens = new Map()

function clientIp(req) {
  return String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown')
    .split(',')[0]
    .trim()
}

function rateLimit(req, res, next) {
  const key = `${req.path}:${clientIp(req)}`
  const now = Date.now()
  const windowMs = 60 * 60 * 1000
  const max = req.path.includes('login') ? 10 : 20
  const entry = hits.get(key) || { count: 0, start: now }
  if (now - entry.start > windowMs) {
    entry.count = 0
    entry.start = now
  }
  entry.count += 1
  hits.set(key, entry)
  if (entry.count > max) {
    return res.status(429).json({ error: 'Too many attempts. Try again later.' })
  }
  return next()
}

function parseMonth(value) {
  const match = /^(\d{4})-(\d{2})$/.exec(value || '')
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  if (month < 1 || month > 12) return null
  return { year, month }
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function adminPassword() {
  return process.env.ADMIN_PASSWORD || ''
}

function passwordsMatch(input, expected) {
  const a = Buffer.from(String(input))
  const b = Buffer.from(String(expected))
  if (!expected || a.length !== b.length) {
    const dummy = Buffer.alloc(32)
    timingSafeEqual(dummy, dummy)
    return false
  }
  return timingSafeEqual(a, b)
}

function requireAdmin(req, res, next) {
  const header = String(req.headers.authorization || '')
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  const expires = tokens.get(token)
  if (!token || !expires || expires < Date.now()) {
    return res.status(401).json({ error: 'Sign in again.' })
  }
  return next()
}

router.get('/availability', async (req, res, next) => {
  try {
    const parsed = parseMonth(Array.isArray(req.query.month) ? req.query.month[0] : req.query.month)
    const now = new Date()
    const fallback = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
    }
    const { fromDate, toDate } = monthBounds(parsed?.year || fallback.year, parsed?.month || fallback.month)
    const bookedStarts = await listBookedStarts()
    const payload = listOpenSlots({ fromDate, toDate, bookedStarts, now })
    res.json(payload)
  } catch (error) {
    next(error)
  }
})

router.post('/book', rateLimit, async (req, res, next) => {
  try {
    const name = String(req.body?.name || '').trim()
    const email = String(req.body?.email || '').trim().toLowerCase()
    const company = String(req.body?.company || '').trim()
    const note = String(req.body?.note || '').trim()
    const start = String(req.body?.start || '').trim()

    if (name.length < 2 || name.length > 80) {
      return res.status(400).json({ error: 'Add your name so I know who I’m meeting.' })
    }
    if (!emailPattern.test(email) || email.length > 120) {
      return res.status(400).json({ error: 'That email doesn’t look right.' })
    }
    if (company.length > 80) {
      return res.status(400).json({ error: 'Company name is too long.' })
    }
    if (note.length > 500) {
      return res.status(400).json({ error: 'Keep the note under 500 characters.' })
    }

    const bookedStarts = await listBookedStarts()
    const slot = findSlot(start, bookedStarts)
    if (!slot) {
      return res.status(409).json({ error: 'That time isn’t open. Pick another slot.' })
    }

    const booking = await createBooking({
      start: slot.start,
      end: slot.end,
      name,
      email,
      company,
      note,
    })

    const timezone = getConfig().timezone
    const ics = buildInvite({ booking, slot })
    let emailed = false
    try {
      const result = await sendBookingMail({ booking, slot, ics, timezone })
      emailed = result.emailed
    } catch (error) {
      console.error('Booking email failed:', error)
    }

    res.status(201).json({
      ok: true,
      emailed,
      start: slot.start,
      end: slot.end,
      ics,
    })
  } catch (error) {
    next(error)
  }
})

router.post('/admin/login', rateLimit, (req, res) => {
  const expected = adminPassword()
  if (!expected) {
    return res.status(503).json({ error: 'Set ADMIN_PASSWORD before using the admin page.' })
  }
  if (!passwordsMatch(req.body?.password, expected)) {
    return res.status(401).json({ error: 'Wrong password.' })
  }
  const token = randomBytes(32).toString('hex')
  tokens.set(token, Date.now() + 12 * 60 * 60 * 1000)
  res.json({ token })
})

router.get('/admin/availability', requireAdmin, (req, res) => {
  res.json(getConfig())
})

router.put('/admin/availability', requireAdmin, async (req, res, next) => {
  try {
    const saved = await saveConfig(req.body)
    res.json(saved)
  } catch (error) {
    next(error)
  }
})

router.get('/admin/bookings', requireAdmin, async (req, res, next) => {
  try {
    const bookings = await listBookings()
    res.json({
      bookings: bookings.map((booking) => ({
        id: booking.id,
        start: booking.start,
        end: booking.end,
        name: booking.name,
        email: booking.email,
        company: booking.company,
        note: booking.note,
      })),
    })
  } catch (error) {
    next(error)
  }
})

router.delete('/admin/bookings/:id', requireAdmin, async (req, res, next) => {
  try {
    await cancelBooking(String(req.params.id || ''))
    res.json({ ok: true })
  } catch (error) {
    next(error)
  }
})

export default router
