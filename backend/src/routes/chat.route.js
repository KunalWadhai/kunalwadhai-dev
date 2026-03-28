import { Router } from 'express'
import { chat } from '../services/llm.service.js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const profile = JSON.parse(
    readFileSync(join(__dirname, '../data/profile.json'), 'utf-8'),
)

const router = Router()

/**
 * POST /api/chat
 * Body: { message: string, history?: Array<{role, content}> }
 * Returns: { ok: true, answer: string }
 */
router.post('/', async (req, res, next) => {
    try {
        const { message, history } = req.body

        if (!message || typeof message !== 'string' || !message.trim()) {
            return res.status(400).json({ ok: false, error: 'message is required' })
        }
        if (message.trim().length > 1000) {
            return res.status(400).json({ ok: false, error: 'message too long (max 1000 chars)' })
        }

        // Build conversation history: max last 10 exchanges to stay within token budget
        const safeHistory = Array.isArray(history) ? history.slice(-10) : []
        const messages = [
            ...safeHistory.map((m) => ({
                role: m.role === 'user' || m.role === 'assistant' ? m.role : 'user',
                content: String(m.content || '').slice(0, 1000),
            })),
            { role: 'user', content: message.trim() },
        ]

        const answer = await chat(messages, profile)
        res.json({ ok: true, answer })
    } catch (err) {
        next(err)
    }
})

export default router
