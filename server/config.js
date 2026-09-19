import { readFileSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const defaultFile = join(root, 'availability.json')
const liveFile = join(root, 'data', 'availability.json')

const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/
const DATE = /^\d{4}-\d{2}-\d{2}$/
const TIMEZONES = [
  'America/Edmonton',
  'America/Vancouver',
  'America/Winnipeg',
  'America/Toronto',
  'America/New_York',
  'UTC',
]

function emptyHours() {
  return Object.fromEntries(WEEKDAYS.map((day) => [day, []]))
}

function parseHm(value) {
  const [h, m] = value.split(':').map(Number)
  return h * 60 + m
}

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'))
}

function normalizeWindows(windows) {
  if (!Array.isArray(windows)) return []
  return windows
    .map((pair) => (Array.isArray(pair) ? [String(pair[0] || ''), String(pair[1] || '')] : null))
    .filter(Boolean)
}

export function validateConfig(input) {
  if (!input || typeof input !== 'object') {
    const error = new Error('Availability settings are missing.')
    error.status = 400
    throw error
  }

  const timezone = String(input.timezone || '')
  if (!TIMEZONES.includes(timezone)) {
    const error = new Error('Pick a timezone from the list.')
    error.status = 400
    throw error
  }

  const durationMinutes = Number(input.durationMinutes)
  const bufferMinutes = Number(input.bufferMinutes)
  const minNoticeMinutes = Number(input.minNoticeMinutes)
  const daysAhead = Number(input.daysAhead)

  if (![15, 20, 30, 45, 60].includes(durationMinutes)) {
    const error = new Error('Meeting length has to be 15, 20, 30, 45, or 60 minutes.')
    error.status = 400
    throw error
  }
  if (![0, 10, 15, 30].includes(bufferMinutes)) {
    const error = new Error('Buffer has to be 0, 10, 15, or 30 minutes.')
    error.status = 400
    throw error
  }
  if (!Number.isInteger(minNoticeMinutes) || minNoticeMinutes < 0 || minNoticeMinutes > 2880) {
    const error = new Error('Minimum notice has to be between 0 and 48 hours.')
    error.status = 400
    throw error
  }
  if (!Number.isInteger(daysAhead) || daysAhead < 7 || daysAhead > 90) {
    const error = new Error('Open the calendar between 7 and 90 days ahead.')
    error.status = 400
    throw error
  }

  const hours = emptyHours()
  const incoming = input.hours && typeof input.hours === 'object' ? input.hours : {}
  for (const day of WEEKDAYS) {
    const windows = normalizeWindows(incoming[day])
    for (const [start, end] of windows) {
      if (!TIME.test(start) || !TIME.test(end) || parseHm(start) >= parseHm(end)) {
        const error = new Error(`Check the hours on ${day}.`)
        error.status = 400
        throw error
      }
    }
    hours[day] = windows
  }

  const blockedDates = [...new Set((Array.isArray(input.blockedDates) ? input.blockedDates : []).map(String))]
    .filter((date) => DATE.test(date))
    .sort()

  const dateHours = {}
  const incomingDates = input.dateHours && typeof input.dateHours === 'object' ? input.dateHours : {}
  for (const [date, windows] of Object.entries(incomingDates)) {
    if (!DATE.test(date)) continue
    const normalized = normalizeWindows(windows)
    for (const [start, end] of normalized) {
      if (!TIME.test(start) || !TIME.test(end) || parseHm(start) >= parseHm(end)) {
        const error = new Error(`Check the hours on ${date}.`)
        error.status = 400
        throw error
      }
    }
    dateHours[date] = normalized
  }

  return {
    timezone,
    durationMinutes,
    bufferMinutes,
    minNoticeMinutes,
    daysAhead,
    hours,
    blockedDates,
    dateHours,
  }
}

function load() {
  const defaults = validateConfig({
    blockedDates: [],
    dateHours: {},
    ...readJson(defaultFile),
  })
  try {
    return validateConfig({
      ...defaults,
      ...readJson(liveFile),
    })
  } catch (error) {
    if (error.code === 'ENOENT') return defaults
    console.error('Could not read live availability file, using defaults.', error)
    return defaults
  }
}

let config = load()

export function getConfig() {
  return config
}

export async function saveConfig(input) {
  const next = validateConfig(input)
  await mkdir(dirname(liveFile), { recursive: true })
  await writeFile(liveFile, `${JSON.stringify(next, null, 2)}\n`, 'utf8')
  config = next
  return config
}

export { TIMEZONES, WEEKDAYS }
