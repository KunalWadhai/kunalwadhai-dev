import { OPENAI_API_KEY, OPENAI_MODEL } from "../constants.js";

export const chat = async () => {
  const schema = z.object({
    message: z.string().min(1).max(4000),
  })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid request',
      details: parsed.error.flatten(),
    })
  }

  const { message } = parsed.data

  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return res.status(500).json({
        error:
          'LLM is not configured. Add OPENAI_API_KEY in backend/.env and restart the server.',
      })
    }

    const openai = new OpenAI({ apiKey })
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'

    const context = profileToContext(profile)
    const system = [
      `You are a portfolio assistant for Kunal Wadhai.`,
      `You must answer using ONLY the provided portfolio context.`,
      `If the user asks for something not in the context, say you don't have that info and ask a follow-up question.`,
      `Keep answers concise, helpful, and friendly. Use bullet points if it improves clarity.`,
    ].join('\n')

    const userPrompt = [
      `Portfolio context:\n${context}`,
      ``,
      `User message: ${message}`,
    ].join('\n')

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.4,
    })

    const answer =
      completion?.choices?.[0]?.message?.content?.trim() ||
      'No response generated.'

    res.json({ answer })
  } catch (err) {
    console.error('Chat error:', err)
    res.status(500).json({
      error: 'Failed to generate answer from LLM.',
    })
  }
}