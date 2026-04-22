import dotenv from 'dotenv'

dotenv.config()

function required(name) {
  const val = process.env[name]
  if (!val) {
    console.error(`❌ Missing required environment variable: ${name}`)
    process.exit(1)
  }
  return val
}

function optional(name, fallback = '') {
  return process.env[name] || fallback
}

// Validate on startup
const LLM_API_KEY = required('LLAMA_OPENAI_KEY')
const LLM_BASE_URL = required('LLAMA_BASE_URL')
const PORT = parseInt(optional('PORT', '4000'), 10)

if (isNaN(PORT)) {
  console.error('❌ PORT must be a number')
  process.exit(1)
}

export const env = {
  PORT,
  FRONTEND_ORIGIN: optional('FRONTEND_ORIGIN', 'http://localhost:5173'),
  LLM_API_KEY,
  LLM_BASE_URL,
  LLM_MODEL: optional('LLM_MODEL', 'openai/gpt-oss-20b'),
  GITHUB_TOKEN: optional('GITHUB_TOKEN', ''),
  NODE_ENV: optional('NODE_ENV', 'development'),
  LOG_LEVEL: optional('LOG_LEVEL', 'info'),
}
