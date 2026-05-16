import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { env } from './config/env.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import { requestLogger } from './middleware/requestLogger.js'
import { logger } from './utils/logger.js'
import profileRoute from './routes/profile.route.js'
import chatRoute from './routes/chat.route.js'
import githubRoute from './routes/github.route.js'
import codingRoute from './routes/coding.route.js'

export function createApp() {
  const app = express()

  // Security headers
  app.use(helmet())

  // CORS configuration
  app.use(
    cors({
      origin:
        env.FRONTEND_ORIGIN === '*'
          ? true
          : env.FRONTEND_ORIGIN.split(',').map((o) => o.trim()),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      optionsSuccessStatus: 200,
    }),
  )

  // Body parsing with size limits
  app.use(express.json({ limit: '512kb' }))
  app.use(express.urlencoded({ extended: true, limit: '512kb' }))

  // Request logging middleware
  app.use(requestLogger)

  // Global rate limiter
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path === '/health', // Don't rate limit health check
  })
  app.use(globalLimiter)

  // Chat-specific rate limiter (stricter)
  const chatLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute
    message: 'Too many chat requests, please try again in a moment.',
    standardHeaders: true,
    legacyHeaders: false,
  })

  // Health check
  app.get('/health', (req, res) => {
    res.json({
      ok: true,
      ts: new Date().toISOString(),
      env: env.NODE_ENV,
    })
  })

  // Routes
  app.use('/api/profile', profileRoute)
  app.use('/api/chat', chatLimiter, chatRoute)
  app.use('/api/github', githubRoute)
  app.use('/api/coding', codingRoute)

  // 404 handler
  app.use(notFound)

  // Error handler (must be last)
  app.use(errorHandler)

  return app
}
