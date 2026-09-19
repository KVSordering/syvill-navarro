import express from 'express'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import router from './router.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')

export function createApp({ serveStatic = false } = {}) {
  const app = express()
  app.disable('x-powered-by')
  app.use(express.json({ limit: '32kb' }))
  app.use('/api', router)

  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error)
    const status = error.status || 500
    res.status(status).json({
      error: status === 500 ? 'Something went wrong. Try another time.' : error.message,
    })
  })

  if (serveStatic && existsSync(dist)) {
    app.use(express.static(dist))
    app.use((req, res, next) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') return next()
      if (req.path.startsWith('/api')) return next()
      res.sendFile(join(dist, 'index.html'))
    })
  }

  return app
}
