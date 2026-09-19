import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'

const file = join(dirname(fileURLToPath(import.meta.url)), 'data', 'bookings.json')

let queue = Promise.resolve()

function withLock(fn) {
  const run = queue.then(fn, fn)
  queue = run.catch(() => {})
  return run
}

async function readAll() {
  try {
    const raw = await readFile(file, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    if (error.code === 'ENOENT') return []
    throw error
  }
}

async function writeAll(bookings) {
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, `${JSON.stringify(bookings, null, 2)}\n`, 'utf8')
}

export function listBookedStarts() {
  return withLock(async () => {
    const bookings = await readAll()
    return bookings.map((booking) => booking.start)
  })
}

export function listBookings() {
  return withLock(async () => {
    const bookings = await readAll()
    return bookings.slice().sort((a, b) => new Date(a.start) - new Date(b.start))
  })
}

export function cancelBooking(id) {
  return withLock(async () => {
    const bookings = await readAll()
    const next = bookings.filter((booking) => booking.id !== id)
    if (next.length === bookings.length) {
      const error = new Error('That booking was already removed.')
      error.status = 404
      throw error
    }
    await writeAll(next)
  })
}

export function createBooking(entry) {
  return withLock(async () => {
    const bookings = await readAll()
    const taken = bookings.some((booking) => booking.start === entry.start)
    if (taken) {
      const error = new Error('That time was just taken. Pick another slot.')
      error.status = 409
      throw error
    }
    const booking = { id: randomUUID(), createdAt: new Date().toISOString(), ...entry }
    bookings.push(booking)
    await writeAll(bookings)
    return booking
  })
}
