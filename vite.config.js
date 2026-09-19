import { config as loadEnv } from 'dotenv'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { createApp } from './server/app.js'

loadEnv()

function bookingApi() {
  const app = createApp({ serveStatic: false })
  return {
    name: 'booking-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api')) return next()
        app(req, res, next)
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api')) return next()
        app(req, res, next)
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), bookingApi()],
})
