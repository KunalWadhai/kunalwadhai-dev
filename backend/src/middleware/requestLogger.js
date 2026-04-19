import { logger } from '../utils/logger.js'

/**
 * Middleware to log incoming requests and response times
 */
export function requestLogger(req, res, next) {
  const start = Date.now()

  // Override res.json to capture response data
  const originalJson = res.json
  res.json = function (data) {
    const duration = Date.now() - start
    const statusCode = res.statusCode

    logger.info(`${req.method} ${req.path}`, {
      method: req.method,
      path: req.path,
      statusCode,
      duration: `${duration}ms`,
      contentType: req.get('content-type'),
    })

    return originalJson.call(this, data)
  }

  next()
}
