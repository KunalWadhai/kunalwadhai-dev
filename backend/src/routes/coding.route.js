import { Router } from 'express'
import { getLeetCodeSummary } from '../services/coding.service.js'

const router = Router()

router.get('/leetcode', async (req, res, next) => {
  try {
    const username = req.query.username?.toString().trim()
    if (!username) {
      return res.status(400).json({ ok: false, error: 'username query param is required' })
    }
    const summary = await getLeetCodeSummary(username)
    res.json({ ok: true, ...summary })
  } catch (err) {
    next(err)
  }
})

export default router
