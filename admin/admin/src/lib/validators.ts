import { z } from 'zod';

export const templateSchema = z.object({
  content: z.string().min(10, "Content must be at least 10 characters"),
  mediaUrl: z.string().url().optional(),
  isActive: z.boolean().default(true)
});