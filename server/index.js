import { config } from 'dotenv'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createApp } from './app.js'
import { mailConfigured } from './mail.js'

config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env') })

const port = Number(process.env.PORT) || 3000
const app = createApp({ serveStatic: true })

app.listen(port, '0.0.0.0', () => {
  console.log(`Booking site listening on ${port}`)
  if (!mailConfigured()) {
    console.warn('GMAIL_APP_PASSWORD is not set. Bookings will save, but Gmail invites will not send.')
  }
})
