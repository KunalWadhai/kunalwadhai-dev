import { OpenAI } from 'openai'
import { env } from '../config/env.js'
import { logger } from '../utils/logger.js'
import { AppError } from '../middleware/errorHandler.js'

const llmClient = new OpenAI({
  apiKey: env.LLM_API_KEY,
  baseURL: env.LLM_BASE_URL,
  timeout: 30000, // 30 second timeout
})

export function buildSystemPrompt(profile) {
  const expLines = (profile.experience || []).map((ex) => {
    const when = `${ex.start} → ${ex.end || 'Present'}`
    const achievements = (ex.achievements || [])
      .map((a) => {
        const pts = (a.points || []).map((p) => `    - ${p}`).join('\n')
        return `  • ${a.title}:\n${pts}`
      })
      .join('\n')
    const tech = (ex.technologies || []).join(', ')
    return `**${ex.company}** — ${ex.role} (${when})\n${achievements}\nTech: ${tech}`
  })

  const skillLines = Object.entries(profile.skills?.groups || {})
    .map(([group, items]) => `  ${group}: ${items.join(', ')}`)
    .join('\n')

  const eduLines = (profile.education || [])
    .map((e) => `  ${e.school} — ${e.degree} (${e.startYear}–${e.endYear})`)
    .join('\n')

  const projectLines = (profile.projects || [])
    .map((p) => `  ${p.name} — ${p.description} [${p.url}] | GitHub: ${p.githubUrl}`)
    .join('\n')

  return `You are an AI assistant for ${profile.name}'s personal portfolio website.
Your job is to represent ${profile.name} professionally, answer questions about their background, skills, experience, projects, and help visitors understand why they'd be a great hire or collaborator.

== PROFILE ==
Name: ${profile.name}
Title: ${profile.title}
Location: ${profile.location}
Email: ${profile.social?.email}
LinkedIn: ${profile.social?.linkedinUrl}
GitHub: ${profile.social?.githubUrl}
LeetCode: ${profile.social?.leetcodeUrl}

Bio: ${profile.bio || ''}

== EXPERIENCE ==
${expLines.join('\n\n')}

== EDUCATION ==
${eduLines}

== SKILLS ==
${skillLines}

== PROJECTS ==
${projectLines}

== INSTRUCTIONS ==
- Always answer in first person as ${profile.name} ("I built...", "My experience includes...")
- Be concise, professional, and enthusiastic — like a senior engineer who loves their craft
- If asked about contact, provide email (${profile.social?.email}) and LinkedIn
- If asked something outside this profile scope, say: "That's outside what I can speak to directly — feel free to reach out at ${profile.social?.email}"
- Never fabricate experience or skills not listed above
- Use a structured format with short paragraphs and bullet lists for readability
- When sharing sections, use clear labels like "Current role", "Past experience", "Education", "Technical stack", "Projects", "Contact"
- Use markdown-style bullets ("- ") and bold labels ("**Label**")
- Keep responses under 300 words unless a detailed explanation is genuinely needed`
}

export async function chat(messages, profile) {
  if (!messages || !Array.isArray(messages)) {
    throw new AppError('Invalid messages format', 400, 'INVALID_MESSAGES')
  }

  if (messages.length === 0) {
    throw new AppError('No messages provided', 400, 'NO_MESSAGES')
  }

  const systemPrompt = buildSystemPrompt(profile)

  try {
    logger.debug('Calling LLM API', {
      model: env.LLM_MODEL,
      baseURL: env.LLM_BASE_URL,
      messageCount: messages.length,
    })

    const completion = await llmClient.chat.completions.create({
      model: env.LLM_MODEL,
      max_tokens: 4096,
      temperature: 0.72,
      top_p: 1,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    })

    const answer = completion.choices?.[0]?.message?.content?.trim()
    if (!answer) {
      throw new AppError('LLM returned an empty response', 502, 'LLM_EMPTY_RESPONSE')
    }

    logger.debug('LLM API call successful', {
      tokensUsed: completion.usage?.total_tokens,
    })

    return answer
  } catch (err) {
    logger.error('LLM API Error', {
      message: err.message,
      status: err.status,
      type: err.type,
    })

    if (err instanceof AppError) {
      throw err
    }

    if (err.code === 'RATE_LIMIT_EXCEEDED') {
      throw new AppError('Too many requests. Please try again later.', 429, 'RATE_LIMIT')
    }

    if (err.status === 401) {
      throw new AppError('LLM authentication failed', 500, 'LLM_AUTH_FAILED')
    }

    if (err.status === 429) {
      throw new AppError('LLM service rate limited. Please try again in a moment.', 429, 'LLM_RATE_LIMIT')
    }

    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      throw new AppError('LLM service timed out. Please try again.', 504, 'LLM_TIMEOUT')
    }

    throw new AppError('Failed to generate response. Please try again.', 500, 'LLM_ERROR')
  }
}
