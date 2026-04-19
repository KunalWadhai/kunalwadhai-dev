import { logger } from '../utils/logger.js'

const DEFAULT_ERROR_MSG = 'An error occurred. Please try again later.'

export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'UNKNOWN_ERROR') {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.timestamp = new Date().toISOString()
  }
}

export function errorHandler(err, req, res, next) {
  const isAppError = err instanceof AppError
  const status = isAppError ? err.statusCode : err.status || err.statusCode || 500
  const code = isAppError ? err.code : 'UNKNOWN_ERROR'
  const message = isAppError ? err.message : DEFAULT_ERROR_MSG

  const errorResponse = {
    ok: false,
    error: message,
    code,
    timestamp: new Date().toISOString(),
  }

  // Add error details in development only
  if (process.env.NODE_ENV === 'development') {
    errorResponse.details = {
      stack: err.stack,
      originalError: err.message,
    }
  }

  // Log error
  logger.error(`${req.method} ${req.path} → ${status}`, {
    code,
    message,
    path: req.path,
    method: req.method,
  })

  res.status(status).json(errorResponse)
}

/**
 * 404 handler — must be registered after all routes.
 */
export function notFound(req, res) {
  res.status(404).json({
    ok: false,
    error: `Route not found: ${req.method} ${req.path}`,
    code: 'NOT_FOUND',
    timestamp: new Date().toISOString(),
  })
}
