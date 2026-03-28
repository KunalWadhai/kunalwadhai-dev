import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import profileRoute from './routes/profile.route.js'
import chatRoute from './routes/chat.route.js'
import githubRoute from './routes/github.route.js'

export function createApp() {
    const app = express()

    // ─── CORS ───────────────────────────────────────────────────────────────
    app.use(
        cors({
            origin: env.FRONTEND_ORIGIN === '*' ? true : env.FRONTEND_ORIGIN.split(',').map((o) => o.trim()),
            credentials: true,
        }),
    )

    // ─── Body parsing ────────────────────────────────────────────────────────
    app.use(express.json({ limit: '512kb' }))
    app.use(express.urlencoded({ extended: true, limit: '512kb' }))

    // ─── Health check ────────────────────────────────────────────────────────
    app.get('/health', (req, res) => {
        res.json({ ok: true, ts: new Date().toISOString(), env: env.NODE_ENV })
    })

    // ─── Routes ──────────────────────────────────────────────────────────────
    app.use('/api/profile', profileRoute)
    app.use('/api/chat', chatRoute)
    app.use('/api/github', githubRoute)

    // ─── 404 + Error handler ─────────────────────────────────────────────────
    app.use(notFound)
    app.use(errorHandler)

    return app
}
