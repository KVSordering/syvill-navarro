import { createTransport } from 'nodemailer'

function hostEmail() {
  return process.env.GMAIL_USER || 'carlsyvillnavarro@gmail.com'
}

function appPassword() {
  return process.env.GMAIL_APP_PASSWORD || ''
}

function icsDate(iso) {
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
}

function fold(line) {
  const chunks = []
  for (let i = 0; i < line.length; i += 74) {
    chunks.push((i === 0 ? '' : ' ') + line.slice(i, i + 74))
  }
  return chunks.join('\r\n')
}

export function buildInvite({ booking, slot }) {
  const uid = `${booking.id}@syvillnavarro.com`
  const summary = 'Chat with Syvill Navarro'
  const description = [
    booking.note && `Notes: ${booking.note}`,
    booking.company && `Company: ${booking.company}`,
    `Booked by ${booking.name} (${booking.email})`,
  ]
    .filter(Boolean)
    .join('\\n')

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Syvill Navarro//Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    fold(`UID:${uid}`),
    `DTSTAMP:${icsDate(booking.createdAt)}`,
    `DTSTART:${icsDate(slot.start)}`,
    `DTEND:${icsDate(slot.end)}`,
    fold(`SUMMARY:${summary}`),
    fold(`DESCRIPTION:${description}`),
    fold(`ORGANIZER;CN=Syvill Navarro:mailto:${hostEmail()}`),
    fold(`ATTENDEE;CN=${booking.name};RSVP=TRUE:mailto:${booking.email}`),
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR',
  ]

  return lines.join('\r\n')
}

export function mailConfigured() {
  return Boolean(hostEmail() && appPassword())
}

function transporter() {
  return createTransport({
    service: 'gmail',
    auth: {
      user: hostEmail(),
      pass: appPassword(),
    },
  })
}

function formatWhen(iso, timeZone) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
    timeZoneName: 'short',
  }).format(new Date(iso))
}

export async function sendBookingMail({ booking, slot, ics, timezone }) {
  if (!mailConfigured()) {
    return { emailed: false }
  }

  const when = formatWhen(slot.start, timezone)
  const mailer = transporter()
  const invite = {
    filename: 'chat-with-syvill-navarro.ics',
    content: ics,
    contentType: 'text/calendar; method=REQUEST; charset=UTF-8',
  }

  await mailer.sendMail({
    from: `Syvill Navarro <${hostEmail()}>`,
    to: booking.email,
    subject: `You're booked — ${when}`,
    text: `Hi ${booking.name},\n\nYou're booked for a 30-minute chat with Syvill Navarro.\n\nWhen: ${when}\n\nAdd the attached invite to your calendar. If plans change, reply to this email.\n`,
    attachments: [invite],
  })

  await mailer.sendMail({
    from: `Syvill Navarro site <${hostEmail()}>`,
    to: hostEmail(),
    subject: `New chat booked — ${booking.name}`,
    text: [
      `${booking.name} booked a 30-minute chat.`,
      `When: ${when}`,
      `Email: ${booking.email}`,
      booking.company ? `Company: ${booking.company}` : null,
      booking.note ? `Notes: ${booking.note}` : null,
    ]
      .filter(Boolean)
      .join('\n'),
    attachments: [invite],
  })

  return { emailed: true }
}
