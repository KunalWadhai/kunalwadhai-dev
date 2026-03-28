import dotenv from 'dotenv'
dotenv.config()

function required(name) {
  const val = process.env[name]
  if (!val) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return val
}

function optional(name, fallback = '') {
  return process.env[name] || fallback
}

export const env = {
  PORT: parseInt(optional('PORT', '4000'), 10),
  FRONTEND_ORIGIN: optional('FRONTEND_ORIGIN', '*'),
  OPENAI_API_KEY: required('OPENAI_API_KEY'),
  OPENAI_MODEL: optional('OPENAI_MODEL', 'gpt-4o-mini'),
  GITHUB_TOKEN: optional('GITHUB_TOKEN', ''),
  NODE_ENV: optional('NODE_ENV', 'development'),
}
