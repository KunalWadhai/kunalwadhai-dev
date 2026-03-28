/**
 * Global Express error handler.
 * Always returns JSON — never leaks stack traces in production.
 */
export function errorHandler(err, req, res, next) {
    const status = err.status || err.statusCode || 500
    const message = err.message || 'Internal Server Error'

    console.error(`[ERROR] ${req.method} ${req.path} → ${status}: ${message}`)
    if (process.env.NODE_ENV !== 'production' && err.stack) {
        console.error(err.stack)
    }

    res.status(status).json({
        ok: false,
        error: message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    })
}

/**
 * 404 handler — must be registered after all routes.
 */
export function notFound(req, res) {
    res.status(404).json({ ok: false, error: `Route not found: ${req.method} ${req.path}` })
}
