import './config/env.js' // validates env vars on startup
import { env } from './config/env.js'
import { createApp } from './app.js'

const app = createApp()

app.listen(env.PORT, () => {
  console.log(`\n Portfolio backend running`)
  console.log(`   • http://localhost:${env.PORT}/health`)
  console.log(`   • http://localhost:${env.PORT}/api/profile`)
  console.log(`   • http://localhost:${env.PORT}/api/chat  (POST)`)
  console.log(`   • http://localhost:${env.PORT}/api/github/summary`)
  console.log(`   • Model: ${env.OPENAI_MODEL}`)
  console.log(`   • Env:   ${env.NODE_ENV}\n`)
})
