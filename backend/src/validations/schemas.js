import { z } from 'zod'

export const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(5000),
})

export const chatRequestSchema = z.object({
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(1000, 'Message too long (max 1000 chars)')
    .trim(),
  history: z
    .array(chatMessageSchema)
    .max(20, 'History too long (max 20 messages)')
    .optional()
    .default([]),
})

export const validateChatRequest = (data) => {
  try {
    const result = chatRequestSchema.safeParse(data)
    if (!result.success) {
      return {
        valid: false,
        errors: result.error.flatten(),
      }
    }
    return {
      valid: true,
      data: result.data,
    }
  } catch (err) {
    return {
      valid: false,
      error: 'Validation error',
    }
  }
}
