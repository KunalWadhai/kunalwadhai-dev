import { OpenAI } from 'openai'
import { env } from '../config/env.js'

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY })

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
- Format code or lists with markdown when appropriate
- Keep responses under 300 words unless a detailed explanation is genuinely needed`
}

export async function chat(messages, profile) {
    const systemPrompt = buildSystemPrompt(profile)

    const completion = await openai.chat.completions.create({
        model: env.OPENAI_MODEL,
        max_tokens: 600,
        temperature: 0.72,
        messages: [
            { role: 'system', content: systemPrompt },
            ...messages,
        ],
    })

    const answer = completion.choices?.[0]?.message?.content?.trim()
    if (!answer) throw Object.assign(new Error('LLM returned an empty response'), { status: 502 })
    return answer
}
