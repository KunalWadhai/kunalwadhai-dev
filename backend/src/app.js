import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { env } from './config/env.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import profileRoute from './routes/profile.js'
import chatRoute from './routes/chat.js'
import githubRoute from './routes/github.js'

export function createApp() {
    const app = express()

    app.use(helmet());
    app.use(
        cors({
            origin: env.FRONTEND_ORIGIN === '*' ? true : env.FRONTEND_ORIGIN.split(',').map((o) => o.trim()),
            credentials: true,
        }),
    )

    app.use(express.json({ limit: '512kb' }))
    app.use(express.urlencoded({ extended: true, limit: '512kb' }))

    app.get('/health', (req, res) => {
        res.json({ ok: true, ts: new Date().toISOString(), env: env.NODE_ENV })
    })

    app.use('/api/profile', profileRoute)
    app.use('/api/chat', chatRoute)
    app.use('/api/github', githubRoute)

    app.use(notFound)
    app.use(errorHandler)

    return app
}
