import { env } from '../config/env.js'

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
}

const currentLevel = LOG_LEVELS[env.LOG_LEVEL] || 2

function log(level, message, data = {}) {
  if (LOG_LEVELS[level] > currentLevel) return

  const timestamp = new Date().toISOString()
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`

  const logObject = {
    timestamp,
    level,
    message,
    ...data,
  }

  if (level === 'error') {
    console.error(prefix, message, data)
  } else if (level === 'warn') {
    console.warn(prefix, message, data)
  } else {
    console.log(prefix, message, data)
  }
}

export const logger = {
  error: (msg, data) => log('error', msg, data),
  warn: (msg, data) => log('warn', msg, data),
  info: (msg, data) => log('info', msg, data),
  debug: (msg, data) => log('debug', msg, data),
}
