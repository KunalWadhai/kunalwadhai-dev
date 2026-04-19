import { Router } from 'express'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { chat } from '../services/llm.service.js'
import { validateChatRequest } from '../validations/schemas.js'
import { AppError } from '../middleware/errorHandler.js'
import { logger } from '../utils/logger.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const profile = JSON.parse(
  readFileSync(join(__dirname, '../data/profile.json'), 'utf-8'),
)

const router = Router()

router.post('/', async (req, res, next) => {
  try {
    const validation = validateChatRequest(req.body)
    if (!validation.valid) {
      logger.warn('Invalid chat request', {
        errors: validation.errors,
      })
      throw new AppError('Invalid request: ' + JSON.stringify(validation.errors), 400, 'VALIDATION_ERROR')
    }

    const { message, history } = validation.data

    // Ensure history is properly formatted
    const safeHistory = Array.isArray(history) ? history.slice(-10) : []

    const messages = [
      ...safeHistory.map((m) => ({
        role: m.role === 'user' || m.role === 'assistant' ? m.role : 'user',
        content: String(m.content || '').slice(0, 1000),
      })),
      { role: 'user', content: message },
    ]

    logger.debug('Processing chat request', {
      messageLength: message.length,
      historyLength: safeHistory.length,
    })

    const answer = await chat(messages, profile)

    res.json({
      ok: true,
      reply: answer, 
    })
  } catch (err) {
    next(err)
  }
})

export default router
