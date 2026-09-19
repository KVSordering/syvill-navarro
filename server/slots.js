import { getConfig } from './config.js'

function pad(n) {
  return String(n).padStart(2, '0')
}

function tzParts(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    weekday: 'short',
  }).formatToParts(date)

  const get = (type) => parts.find((part) => part.type === type)?.value
  return {
    year: Number(get('year')),
    month: Number(get('month')),
    day: Number(get('day')),
    hour: Number(get('hour')),
    minute: Number(get('minute')),
    second: Number(get('second')),
    weekday: get('weekday'),
  }
}

function weekdayName(date, timeZone) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'long',
  })
    .format(date)
    .toLowerCase()
}

export function zonedLocalToUtc(year, month, day, hour, minute, timeZone) {
  const wanted = Date.UTC(year, month - 1, day, hour, minute, 0)
  let instant = wanted
  for (let i = 0; i < 4; i += 1) {
    const parts = tzParts(new Date(instant), timeZone)
    const got = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second)
    const diff = wanted - got
    if (diff === 0) break
    instant += diff
  }
  return new Date(instant)
}

function dateKey(year, month, day) {
  return `${year}-${pad(month)}-${pad(day)}`
}

function parseHm(value) {
  const [h, m] = value.split(':').map(Number)
  return h * 60 + m
}

function addDays(year, month, day, count) {
  const utc = new Date(Date.UTC(year, month - 1, day + count))
  return {
    year: utc.getUTCFullYear(),
    month: utc.getUTCMonth() + 1,
    day: utc.getUTCDate(),
  }
}

export function listOpenSlots({ fromDate, toDate, bookedStarts, now = new Date() }) {
  const { timezone, durationMinutes, bufferMinutes, minNoticeMinutes, daysAhead, hours, blockedDates, dateHours } =
    getConfig()
  const today = tzParts(now, timezone)
  const minStart = new Date(now.getTime() + minNoticeMinutes * 60 * 1000)
  const lastAllowed = addDays(today.year, today.month, today.day, daysAhead)
  const booked = new Set(bookedStarts.map((start) => new Date(start).toISOString()))
  const blocked = new Set(blockedDates || [])
  const overrides = dateHours || {}
  const days = {}

  let cursor = fromDate
    ? { year: fromDate.year, month: fromDate.month, day: fromDate.day }
    : { year: today.year, month: today.month, day: today.day }

  const last = toDate || lastAllowed

  while (dateKey(cursor.year, cursor.month, cursor.day) <= dateKey(last.year, last.month, last.day)) {
    const key = dateKey(cursor.year, cursor.month, cursor.day)
    const weekday = weekdayName(
      zonedLocalToUtc(cursor.year, cursor.month, cursor.day, 12, 0, timezone),
      timezone,
    )
    const windows = Object.hasOwn(overrides, key) ? overrides[key] : hours[weekday] || []
    const slots = []
    const withinWindow = key <= dateKey(lastAllowed.year, lastAllowed.month, lastAllowed.day)

    if (withinWindow && !blocked.has(key)) {
      for (const [startHm, endHm] of windows) {
        for (
          let minutes = parseHm(startHm);
          minutes + durationMinutes <= parseHm(endHm);
          minutes += durationMinutes + bufferMinutes
        ) {
          const hour = Math.floor(minutes / 60)
          const minute = minutes % 60
          const start = zonedLocalToUtc(cursor.year, cursor.month, cursor.day, hour, minute, timezone)
          const end = new Date(start.getTime() + durationMinutes * 60 * 1000)
          if (start < minStart) continue
          if (booked.has(start.toISOString())) continue
          slots.push({ start: start.toISOString(), end: end.toISOString() })
        }
      }
    }

    days[key] = slots
    cursor = addDays(cursor.year, cursor.month, cursor.day, 1)
  }

  return {
    timezone,
    durationMinutes,
    days,
  }
}

export function monthBounds(year, month) {
  const start = { year, month, day: 1 }
  const next = month === 12 ? { year: year + 1, month: 1, day: 1 } : { year, month: month + 1, day: 1 }
  const last = addDays(next.year, next.month, next.day, -1)
  return { fromDate: start, toDate: last }
}

export function findSlot(startIso, bookedStarts, now = new Date()) {
  const start = new Date(startIso)
  if (Number.isNaN(start.getTime())) return null
  const parts = tzParts(start, getConfig().timezone)
  const { days } = listOpenSlots({
    fromDate: { year: parts.year, month: parts.month, day: parts.day },
    toDate: { year: parts.year, month: parts.month, day: parts.day },
    bookedStarts,
    now,
  })
  const key = dateKey(parts.year, parts.month, parts.day)
  return (days[key] || []).find((slot) => slot.start === start.toISOString()) || null
}
