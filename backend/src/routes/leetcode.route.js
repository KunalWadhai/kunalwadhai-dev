import { Router } from 'express'
import { getLeetcodeStats } from '../services/leetcode.service.js'

const router = Router()

router.get('/stats', async (req, res, next) => {
  try {
    const username = req.query.username?.toString().trim()
    if (!username) {
      return res.status(400).json({ ok: false, error: 'username query param is required' })
    }
    const stats = await getLeetcodeStats(username)
    res.json({ ok: true, ...stats })
  } catch (err) {
    next(err)
  }
})

export default router
