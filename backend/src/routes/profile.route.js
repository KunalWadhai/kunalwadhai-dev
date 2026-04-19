import { Router } from 'express'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const profile = JSON.parse(
    readFileSync(join(__dirname, '../data/profile.json'), 'utf-8'),
)

const router = Router()

router.get('/', (req, res) => {
    res.json(profile)
})

export default router
