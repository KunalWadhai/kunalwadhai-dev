import './config/env.js' // validates env vars on startup
import { env } from './config/env.js'
import { createApp } from './app.js'
import { logger } from './utils/logger.js'

const app = createApp()

const server = app.listen(env.PORT, () => {
  logger.info('🚀 Portfolio Backend Started', {
    port: env.PORT,
    env: env.NODE_ENV,
    model: env.OPENAI_MODEL,
  })
  console.log(`\n✓ Backend running on http://localhost:${env.PORT}`)
  console.log(`  • Health: /health`)
  console.log(`  • Chat:   POST /api/chat`)
  console.log(`  • Profile: /api/profile`)
  console.log(`  • GitHub: /api/github/summary\n`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully...')
  server.close(() => {
    logger.info('Server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully...')
  server.close(() => {
    logger.info('Server closed')
    process.exit(0)
  })
})

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', {
    message: err.message,
    stack: err.stack,
  })
  process.exit(1)
})

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', {
    reason: reason instanceof Error ? reason.message : String(reason),
    promise: String(promise),
  })
})
